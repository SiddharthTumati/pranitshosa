-- ============================================================
-- Open access: every member is admin (no public gatekeeping)
-- Run in Supabase SQL Editor after 0005 (or anytime).
-- ============================================================

-- All new users start as chapter admin
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Member'),
    true
  )
  on conflict (id) do update set is_admin = true;
  return new;
end;
$$;

-- Keep is_admin true after email/confirmation changes
create or replace function public.sync_profile_admin_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set is_admin = true, updated_at = now()
  where id = new.id;
  return new;
end;
$$;

-- Allow self/other profile updates without "don't escalate" guard
drop trigger if exists profiles_no_escalation on public.profiles;

-- Insert policy: anyone authenticated can create their profile as admin
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Existing roster members become admin
update public.profiles set is_admin = true;
