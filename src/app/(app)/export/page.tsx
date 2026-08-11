import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tracker } from "@/components/tracker/Tracker";
import { PrintTrigger } from "./PrintTrigger";
import { AUTH_OPEN, demoDisplayName } from "@/lib/access";
import { chapterName, chapterOfficerEmail } from "@/lib/chapterConfig";
import { EVENTS_WITH_AUDIT_SELECT } from "@/lib/eventQueries";
import type { EventRowWithAudit, Profile } from "@/lib/types";
import { ensureProfile } from "@/lib/ensureProfile";

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
  if (!user) {
    if (!AUTH_OPEN) redirect("/login");
    redirect("/dashboard");
  }

  let profile =
    (await ensureProfile(supabase, user)) ??
    ({
      id: user.id,
      full_name: demoDisplayName(),
      grade: null,
      role: "member" as const,
      is_admin: true,
      year_label: "2025-2026",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } satisfies Profile);

  let userId = user.id;
  if (targetUserId && targetUserId !== user.id) {
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

  const { data: events } = await supabase
    .from("events")
    .select(EVENTS_WITH_AUDIT_SELECT)
    .eq("user_id", userId)
    .order("event_date", { ascending: true });

  const packetGeneratedAt = new Date().toISOString();

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
        profile={{ ...profile, is_admin: true }}
        events={(events as EventRowWithAudit[]) ?? []}
        chapterName={chapterName()}
        officerEmail={chapterOfficerEmail()}
        printMode
        packetGeneratedAt={packetGeneratedAt}
      />
    </>
  );
}
