-- ============================================================
-- Patch for existing Supabase projects that already ran 0001
-- before profiles self-insert + email_is_admin existed.
--
-- Run this in Supabase SQL Editor if users can sign in but have
-- no row in public.profiles.
-- ============================================================

create or replace function public.email_is_admin(p_email text)
returns boolean as $$
  select exists(
    select 1 from public.admin_emails
    where lower(email) = lower(p_email)
  );
$$ language sql stable security definer;

grant execute on function public.email_is_admin(text) to anon, authenticated, service_role;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    public.email_is_admin(new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (
    auth.uid() = id
    and is_admin = public.email_is_admin(auth.jwt() ->> 'email')
  );
