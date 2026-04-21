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
          className="text-sm text-brand-navy hover:underline"
        >
          ← All members
        </Link>
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
