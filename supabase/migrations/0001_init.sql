-- ============================================================
-- HOSA Service Tracker — initial schema
-- Run this in the Supabase SQL Editor (or via CLI: supabase db push)
-- Safe to re-run.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------
-- admin_emails: pre-seeded list of chapter officers / advisors
-- When a user signs up with an email in this table, they get admin=true
-- Add rows via Supabase SQL editor:  insert into admin_emails(email) values ('me@school.org');
-- ----------------------------------------------------------------
create table if not exists public.admin_emails (
  email text primary key,
  added_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- profiles: one row per authenticated user
-- ----------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  grade int,
  role text not null default 'member' check (role in ('member', 'officer')),
  is_admin boolean not null default false,
  year_label text not null default '2025-2026',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- events: participation records, pending until an admin approves
-- ----------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  event_date date not null,
  semester text not null check (semester in ('fall', 'spring')),
  hours numeric(10, 4) not null check (hours > 0),
  category text not null check (category in (
    'Blood Drive', 'Speaker', 'Community', 'Social', 'Health Ed.', 'Other'
  )),
  photo_url text,
  photo_path text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_user_id_idx on public.events(user_id);
create index if not exists events_status_idx on public.events(status);
create index if not exists events_semester_idx on public.events(semester);

-- ----------------------------------------------------------------
-- Triggers: updated_at, escalation guard, handle_new_user
-- ----------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at before update on public.events
  for each row execute function public.set_updated_at();

-- is_admin helper (SECURITY DEFINER so it bypasses RLS to check status)
create or replace function public.is_admin(uid uuid)
returns boolean as $$
  select coalesce((select is_admin from public.profiles where id = uid), false);
$$ language sql security definer stable;

-- SECURITY DEFINER: check admin_emails without exposing the table via RLS
create or replace function public.email_is_admin(p_email text)
returns boolean as $$
  select exists(
    select 1 from public.admin_emails
    where lower(email) = lower(p_email)
  );
$$ language sql stable security definer;

grant execute on function public.email_is_admin(text) to anon, authenticated, service_role;

-- New-user handler: create profile and mark admin if email is pre-listed
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Prevent self-promotion: students can't flip their own is_admin or role
create or replace function public.prevent_profile_escalation()
returns trigger as $$
begin
  if (new.is_admin is distinct from old.is_admin or new.role is distinct from old.role)
     and not public.is_admin(auth.uid()) then
    raise exception 'Only admins can change role or admin status';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_no_escalation on public.profiles;
create trigger profiles_no_escalation before update on public.profiles
  for each row execute function public.prevent_profile_escalation();

-- ----------------------------------------------------------------
-- Row-Level Security
-- ----------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.admin_emails enable row level security;

-- profiles: any authed user can read, users update own, admins update anyone
drop policy if exists "profiles_read_all" on public.profiles;
create policy "profiles_read_all" on public.profiles
  for select using (auth.uid() is not null);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (
    auth.uid() = id
    and is_admin = public.email_is_admin(auth.jwt() ->> 'email')
  );

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles
  for update using (public.is_admin(auth.uid()));

-- events: read rules
drop policy if exists "events_read_own" on public.events;
create policy "events_read_own" on public.events
  for select using (auth.uid() = user_id);

drop policy if exists "events_read_admin" on public.events;
create policy "events_read_admin" on public.events
  for select using (public.is_admin(auth.uid()));

-- insert: students create their own pending events
drop policy if exists "events_insert_own" on public.events;
create policy "events_insert_own" on public.events
  for insert with check (auth.uid() = user_id and status = 'pending');

-- update: student may edit OWN pending event within 24 hrs of creation
drop policy if exists "events_update_own_pending" on public.events;
create policy "events_update_own_pending" on public.events
  for update using (
    auth.uid() = user_id
    and status = 'pending'
    and created_at > now() - interval '24 hours'
  )
  with check (
    auth.uid() = user_id
    and status = 'pending'
  );

-- admins can update any event (approve/reject/edit)
drop policy if exists "events_update_admin" on public.events;
create policy "events_update_admin" on public.events
  for update using (public.is_admin(auth.uid()));

-- delete: admins only (students cannot delete their own)
drop policy if exists "events_delete_admin" on public.events;
create policy "events_delete_admin" on public.events
  for delete using (public.is_admin(auth.uid()));

-- admin_emails: only admins can view/manage
drop policy if exists "admin_emails_admin" on public.admin_emails;
create policy "admin_emails_admin" on public.admin_emails
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ----------------------------------------------------------------
-- Storage: event-photos bucket (public-read; per-user write folders)
-- ----------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', true)
on conflict (id) do nothing;

drop policy if exists "event_photos_read" on storage.objects;
create policy "event_photos_read" on storage.objects
  for select using (bucket_id = 'event-photos');

drop policy if exists "event_photos_insert_own" on storage.objects;
create policy "event_photos_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'event-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "event_photos_delete_admin" on storage.objects;
create policy "event_photos_delete_admin" on storage.objects
  for delete using (
    bucket_id = 'event-photos'
    and public.is_admin(auth.uid())
  );
