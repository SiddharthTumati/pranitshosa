-- Fix profile row insert failing on the server when JWT "email" is missing
-- (SSR / cookie refresh), which left users on "Setting up your profile…".
--
-- Use canonical email from auth.users via a SECURITY DEFINER helper.

create or replace function public.auth_session_email()
returns text
language sql
stable
security definer
set search_path = auth, public
as $$
  select email from auth.users where id = auth.uid();
$$;

grant execute on function public.auth_session_email() to authenticated, service_role;

drop policy if exists "profiles_insert_own" on public.profiles;

create policy "profiles_insert_own" on public.profiles
  for insert with check (
    auth.uid() = id
    and is_admin = public.email_is_admin(public.auth_session_email())
  );
