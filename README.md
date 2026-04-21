# HOSA Service Tracker

A web app that lets a HOSA chapter track every member's service hours and
events in real time. Students submit events (with photo proof) → officers
approve them → hours roll up automatically into a printable tracker.

Built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Supabase**
(Postgres, Auth, Storage).

## Features

- Email/password auth (Supabase Auth)
- Student dashboard that matches the chapter's official tracker design —
  total hours, event log, semester summary, HOSA vs. officer thresholds,
  goal checklist
- Add-event form with **photo upload** to Supabase Storage
- Submissions default to **pending**; only officers can approve/reject
- Students can edit their own event **only within 24 hours** of submission
  and only while it is still pending (enforced both in UI and in Postgres RLS)
- **Students cannot delete** events — only admins can
- Admin panel with approval queue, all-events view, member roster, and
  per-member tracker view
- **Admins are auto-designated** on sign-up if their email is in the
  `admin_emails` table — simple and chapter-controllable
- Print-optimized export page that saves directly as a clean PDF via the
  browser's native Print → Save as PDF dialog

## Setup

### 1. Supabase project

1. Go to [supabase.com](https://supabase.com/) → create a new project.
2. Open **SQL Editor** → paste the contents of
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   and run it. That creates all tables, policies, storage bucket, and
   the `handle_new_user` trigger.
3. Still in the SQL editor, add your officer emails to the admin list:

   ```sql
   insert into admin_emails (email) values
     ('president@yourchapter.org'),
     ('advisor@school.edu');
   ```

   Any user who signs up with one of those emails is auto-flagged as admin.
   You can also flip an existing user to admin from
   **/admin/members/[id]** once you have one admin set up.

4. Go to **Authentication → Providers → Email**. For convenience during
   your chapter rollout, turn **"Confirm email"** off. (Optional — if you
   leave it on, students must click a confirmation link before signing in.)

5. Project Settings → API. Copy the **Project URL** and the **anon public**
   key — you'll need them next.

### 2. Local dev

```bash
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
# (optional: chapter name, officer email)

npm install
npm run dev
```

Visit <http://localhost:3000>.

1. Sign up with an email in your `admin_emails` list → you become admin.
2. Sign up with any other email → that user is a regular student.

### 3. Deploy

Any Next.js-compatible host works. Easiest: push to GitHub, then
import the repo on [Vercel](https://vercel.com/), add the two
`NEXT_PUBLIC_SUPABASE_*` env vars, and deploy.

## Project layout

```
src/
  app/
    layout.tsx                    # Root layout, Inter font
    page.tsx                      # Redirects → /dashboard or /login
    globals.css                   # Tailwind v4 theme + print styles
    login/ signup/                # Public auth pages
    (app)/                        # Authenticated routes
      layout.tsx                  # Top nav, profile lookup
      dashboard/
        page.tsx                  # Student tracker (the hero view)
        add/                      # Add-event form + photo upload
        edit/[id]/                # Edit form (24hr + pending only)
      admin/
        layout.tsx                # Admin-gate
        page.tsx                  # Pending approvals
        all/                      # All events, filterable
        members/                  # Roster, per-member view
      export/                     # Print-friendly tracker for PDF
    actions/
      auth.ts                     # Sign out
      events.ts                   # Approve/reject/delete/update profile
  components/
    TopNav.tsx                    # Main header
    Logo.tsx                      # SVG tracker logo
    tracker/Tracker.tsx           # Main tracker component
    admin/EventReviewCard.tsx     # Approval card
  lib/
    supabase/{client,server,middleware}.ts
    types.ts                      # Shared types, constants, helpers
  middleware.ts                   # Session refresh + auth gate
supabase/
  migrations/0001_init.sql        # Schema + RLS + storage bucket
```

## Environment variables

See [`.env.local.example`](.env.local.example).

| var | required | what |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon/public API key |
| `NEXT_PUBLIC_CHAPTER_NAME` | no | Displayed in header (default: "HOSA Chapter") |
| `NEXT_PUBLIC_YEAR_LABEL` | no | e.g. `2025-2026` |
| `NEXT_PUBLIC_COMMUNITY_SERVICE_EMAIL` | no | Shown in the tracker footer |

## Security model (RLS)

- Students can read **their own** events and **any approved** event.
- Students can only **insert** events with `user_id = auth.uid()` and
  `status = 'pending'`.
- Students can only **update** their own pending events, and only while
  `now() - created_at < 24 hours`.
- Students **cannot delete**. Admins only.
- Admins (`profiles.is_admin = true`) can read, update, and delete any
  event.
- Profile `is_admin` and `role` are trigger-protected — students can't
  promote themselves even by hitting the API directly.
- Storage: users can only upload to a path prefixed with their own uid.

All of the above is enforced in Postgres via RLS, so even a malicious
client using the anon key cannot bypass it.

## PDF export

The `/export` route renders a print-tuned version of the tracker.
Clicking **Print / Save as PDF** opens the browser's native print dialog,
where the student can choose "Save as PDF" as the destination. This
avoids shipping a heavy server-side PDF renderer while producing crisp,
selectable output.
