import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tracker } from "@/components/tracker/Tracker";
import { PrintTrigger } from "./PrintTrigger";
import type { EventRow, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ExportPage({
  searchParams,
}: {
  searchParams: Promise<{ user?: string }>;
}) {
  const { user: targetUserId } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let { data: viewerProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  let profile = viewerProfile;
  let userId = user.id;
  if (targetUserId && viewerProfile?.is_admin && targetUserId !== user.id) {
    const { data: other } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", targetUserId)
      .single<Profile>();
    if (other) {
      profile = other;
      userId = targetUserId;
    }
  }

  if (!profile) return null;

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .order("event_date", { ascending: true });

  const chapterName =
    process.env.NEXT_PUBLIC_CHAPTER_NAME ?? "Marvin Ridge High School HOSA";
  const officerEmail = process.env.NEXT_PUBLIC_COMMUNITY_SERVICE_EMAIL;

  return (
    <>
      <div className="no-print max-w-5xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="text-sm text-brand-navy dark:text-brand-orange hover:underline"
        >
          ← Back to dashboard
        </Link>
        <div className="flex gap-2">
          <PrintTrigger />
        </div>
      </div>
      <Tracker
        profile={profile}
        events={(events as EventRow[]) ?? []}
        chapterName={chapterName}
        officerEmail={officerEmail}
        printMode
      />
    </>
  );
}
