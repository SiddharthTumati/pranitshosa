import { createClient } from "@/lib/supabase/server";
import { EventReviewCard } from "@/components/admin/EventReviewCard";
import type { EventRow } from "@/lib/types";

export const dynamic = "force-dynamic";

type PendingEvent = EventRow & { profile: { full_name: string; grade: number | null } };

export default async function AdminPendingPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*, profile:profiles!events_user_id_fkey(full_name, grade)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const rows = (events as PendingEvent[] | null) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          {rows.length} event{rows.length === 1 ? "" : "s"} waiting for review
        </h2>
      </div>

      {rows.length === 0 ? (
        <div className="tracker-card p-10 text-center text-slate-500">
          <p className="text-lg font-semibold text-slate-700">All caught up.</p>
          <p className="text-sm mt-1">No events are currently pending.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((evt) => (
            <EventReviewCard key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
}
