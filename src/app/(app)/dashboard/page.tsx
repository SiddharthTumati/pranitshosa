import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Tracker } from "@/components/tracker/Tracker";
import { AUTH_OPEN, demoDisplayName } from "@/lib/access";
import { chapterName, chapterOfficerEmail } from "@/lib/chapterConfig";
import { EVENTS_WITH_AUDIT_SELECT } from "@/lib/eventQueries";
import type { EventRowWithAudit, Profile } from "@/lib/types";
import { ensureProfile } from "@/lib/ensureProfile";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function openProfile(userId: string): Profile {
  return {
    id: userId,
    full_name: demoDisplayName(),
    grade: null,
    role: "member",
    is_admin: true,
    year_label: process.env.NEXT_PUBLIC_YEAR_LABEL?.trim() || "2025-2026",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (!AUTH_OPEN) redirect("/login");
    return (
      <div className="max-w-lg mx-auto mt-16 p-6 tracker-card">
        <h2 className="font-semibold text-lg">Almost there</h2>
        <p className="text-sm text-[color:var(--muted)] mt-2">
          Open access needs either an existing session or{" "}
          <strong>Anonymous sign-in</strong> enabled in Supabase (
          Authentication → Providers → Anonymous). Also run migration{" "}
          <code className="text-xs">0006_everyone_admin.sql</code> once.
        </p>
        <p className="text-sm text-[color:var(--muted)] mt-2">
          Then refresh this page — Admin links stay in the top nav either way.
        </p>
      </div>
    );
  }

  const profile = (await ensureProfile(supabase, user)) ?? openProfile(user.id);

  const { data: events } = await supabase
    .from("events")
    .select(EVENTS_WITH_AUDIT_SELECT)
    .eq("user_id", user.id)
    .order("event_date", { ascending: true });

  return (
    <>
      <Tracker
        profile={{ ...profile, is_admin: true }}
        events={(events as EventRowWithAudit[]) ?? []}
        chapterName={chapterName()}
        officerEmail={chapterOfficerEmail()}
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
