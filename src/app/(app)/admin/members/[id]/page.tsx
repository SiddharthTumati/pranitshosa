import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tracker } from "@/components/tracker/Tracker";
import { MemberControls } from "./MemberControls";
import type { EventRow, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single<Profile>();
  if (!profile) notFound();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", id)
    .order("event_date", { ascending: true });

  const chapterName =
    process.env.NEXT_PUBLIC_CHAPTER_NAME ?? "Marvin Ridge High School HOSA";
  const officerEmail = process.env.NEXT_PUBLIC_COMMUNITY_SERVICE_EMAIL;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/members"
          className="text-sm font-medium text-brand-navy dark:text-brand-orange hover:underline"
        >
          ← All members
        </Link>
      </div>

      <div className="tracker-card px-4 sm:px-5 py-4 border-l-[3px] border-l-brand-orange">
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-navy dark:text-brand-orange">
          MRHS HOSA · Member view
        </p>
        <h1 className="text-xl font-semibold text-[color:var(--color-brand-ink)] dark:text-white mt-1">
          {profile.full_name}
        </h1>
        <p className="text-sm text-[color:var(--muted)] dark:text-slate-300 mt-0.5">
          {profile.is_admin ? "Chapter admin" : "Member"} · Year{" "}
          {profile.year_label}
        </p>
      </div>

      <MemberControls profile={profile} />

      <Tracker
        profile={profile}
        events={(events as EventRow[]) ?? []}
        chapterName={chapterName}
        officerEmail={officerEmail}
        viewerIsAdmin
        viewingOther
      />
    </div>
  );
}
