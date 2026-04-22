import { createClient } from "@/lib/supabase/server";
import { PendingQueueClient } from "@/components/admin/PendingQueueClient";
import type { EventWithProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPendingPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*, profile:profiles!events_user_id_fkey(full_name, grade)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const rows = (events as EventWithProfile[] | null) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[color:var(--color-brand-ink)] dark:text-white">
          {rows.length} event{rows.length === 1 ? "" : "s"} waiting for review
        </h2>
      </div>

      {rows.length === 0 ? (
        <div className="tracker-card p-10 text-center text-[color:var(--muted)] dark:text-slate-400">
          <p className="text-lg font-semibold text-[color:var(--color-brand-ink)] dark:text-white">
            All caught up.
          </p>
          <p className="text-sm mt-1 text-[color:var(--muted-2)] dark:text-slate-400">
            No events are currently pending.
          </p>
        </div>
      ) : (
        <PendingQueueClient events={rows} />
      )}
    </div>
  );
}
