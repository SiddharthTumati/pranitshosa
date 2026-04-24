-- ============================================================
-- Signup security: domain allowlist + admin only after verify
-- ============================================================
-- 1) signup_allowed_domains: if EMPTY → any email can sign up (unchanged behavior).
--    If NON-EMPTY → only addresses whose domain matches a row can register
--    (enforced BEFORE INSERT on auth.users).
--
--    Example (run in SQL editor after migrate):
--    insert into public.signup_allowed_domains (domain) values
--      ('yourk12.org'),
--      ('students.yourschool.edu');
--
-- 2) Admin from admin_emails is granted ONLY when email_confirmed_at is set.
--    With "Confirm email" ON in Supabase, squatters cannot claim admin until
--    they verify the inbox for that address.
--
-- 3) When confirmation completes or auth email changes, profiles.is_admin
--    is re-synced from admin_emails.
-- ============================================================

-- Optional allowlist (domain only, no @), lowercase recommended
create table if not exists public.signup_allowed_domains (
  domain text primary key
);

comment on table public.signup_allowed_domains is
  'If empty, any email may sign up. If populated, signups must use one of these domains (after @).';

revoke all on public.signup_allowed_domains from anon, authenticated;

create or replace function public.enforce_signup_email_domain()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
  email_domain text;
begin
  select count(*)::int into n from public.signup_allowed_domains;
  if n = 0 then
    return new;
  end if;

  email_domain := lower(trim(split_part(lower(trim(new.email)), '@', 2)));
  if email_domain = '' then
    raise exception 'Invalid email address';
  end if;

  if not exists (
    select 1
    from public.signup_allowed_domains d
    where lower(trim(d.domain)) = email_domain
  ) then
    raise exception 'SIGNUP_DOMAIN_NOT_ALLOWED';
  end if;

  return new;
end;
$$;

-- Read allowlist only from trigger context (no broad grants on table)
drop trigger if exists enforce_signup_domain_before_insert on auth.users;
create trigger enforce_signup_domain_before_insert
  before insert on auth.users
  for each row
  execute function public.enforce_signup_email_domain();

-- Optional: anon can call for signup form UX (DB remains source of truth)
create or replace function public.signup_domain_is_allowed(check_email text)
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  n int;
  email_domain text;
begin
  select count(*)::int into n from public.signup_allowed_domains;
  if n = 0 then
    return true;
  end if;
  email_domain := lower(trim(split_part(lower(trim(check_email)), '@', 2)));
  if email_domain = '' then
    return false;
  end if;
  return exists (
    select 1
    from public.signup_allowed_domains d
    where lower(trim(d.domain)) = email_domain
  );
end;
$$;

grant execute on function public.signup_domain_is_allowed(text) to anon, authenticated;

-- Admin only once email is confirmed (instant confirm still works)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  grant_admin boolean := false;
begin
  if new.email_confirmed_at is not null then
    grant_admin := public.email_is_admin(lower(trim(new.email)));
  end if;

  insert into public.profiles (id, full_name, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    grant_admin
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- After verify or email change, recompute admin from list
create or replace function public.sync_profile_admin_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is null then
    update public.profiles
    set is_admin = false, updated_at = now()
    where id = new.id;
  else
    update public.profiles
    set
      is_admin = public.email_is_admin(lower(trim(new.email))),
      updated_at = now()
    where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_admin_sync on auth.users;
create trigger on_auth_user_admin_sync
  after update of email, email_confirmed_at on auth.users
  for each row
  when (
    old.email is distinct from new.email
    or old.email_confirmed_at is distinct from new.email_confirmed_at
  )
  execute function public.sync_profile_admin_from_auth();
