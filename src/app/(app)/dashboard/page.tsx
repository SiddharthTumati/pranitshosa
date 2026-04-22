import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Tracker } from "@/components/tracker/Tracker";
import type { EventRow } from "@/lib/types";
import { ensureProfile } from "@/lib/ensureProfile";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await ensureProfile(supabase, user);

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.id)
    .order("event_date", { ascending: true });

  if (!profile) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 tracker-card text-center">
        <h2 className="font-bold mb-2">Couldn&apos;t load your profile</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          You&apos;re signed in, but there&apos;s no profile row yet (or the
          database blocked creating it). Whoever runs your Supabase project should
          open <strong>SQL Editor</strong>, paste in{" "}
          <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">
            0003_profiles_insert_use_auth_users_email.sql
          </span>{" "}
          from the GitHub repo under <span className="font-mono text-xs">supabase/migrations/</span>, run it, then refresh. If you never ran{" "}
          <span className="font-mono text-xs">0002_profile_bootstrap.sql</span>, do that first.
        </p>
      </div>
    );
  }

  const chapterName =
    process.env.NEXT_PUBLIC_CHAPTER_NAME ?? "Marvin Ridge High School HOSA";
  const officerEmail = process.env.NEXT_PUBLIC_COMMUNITY_SERVICE_EMAIL;

  return (
    <>
      <Tracker
        profile={profile}
        events={(events as EventRow[]) ?? []}
        chapterName={chapterName}
        officerEmail={officerEmail}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 flex flex-col sm:flex-row gap-3 no-print">
        <Link
          href="/dashboard/add"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-brand-navy text-white font-semibold hover:bg-brand-navy-dark"
        >
          + Add a new event
        </Link>
        <Link
          href="/export"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
        >
          Export as PDF
        </Link>
      </div>
    </>
  );
}
