import { createClient } from "@/lib/supabase/server";
import { EventReviewCard } from "@/components/admin/EventReviewCard";
import type { EventRow } from "@/lib/types";

export const dynamic = "force-dynamic";

type Row = EventRow & { profile: { full_name: string; grade: number | null } };

export default async function AdminAllEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; semester?: string }>;
}) {
  const { status, semester } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("events")
    .select("*, profile:profiles!events_user_id_fkey(full_name, grade)")
    .order("event_date", { ascending: false });

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    query = query.eq("status", status);
  }
  if (semester && ["fall", "spring"].includes(semester)) {
    query = query.eq("semester", semester);
  }

  const { data } = await query;
  const rows = (data as Row[] | null) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-[color:var(--color-brand-ink)] dark:text-white">
          {rows.length} event{rows.length === 1 ? "" : "s"}
        </h2>
        <form className="flex gap-2 text-sm">
          <select
            name="status"
            defaultValue={status ?? ""}
            className="form-input w-auto"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            name="semester"
            defaultValue={semester ?? ""}
            className="form-input w-auto"
          >
            <option value="">All semesters</option>
            <option value="fall">Fall</option>
            <option value="spring">Spring</option>
          </select>
          <button className="px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border-1)] bg-[var(--surface-1)] text-sm font-semibold text-[color:var(--color-brand-ink)] dark:text-white hover:bg-[var(--surface-2)]">
            Filter
          </button>
        </form>
      </div>

      {rows.length === 0 ? (
        <div className="tracker-card p-10 text-center text-[color:var(--muted)] dark:text-slate-400">
          No events match that filter.
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
