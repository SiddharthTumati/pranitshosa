import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatHours, type Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

type MemberRow = Profile & {
  approved_hours: number;
  total_events: number;
};

export default async function MembersPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name", { ascending: true });

  const { data: approved } = await supabase
    .from("events")
    .select("user_id, hours")
    .eq("status", "approved");

  const { data: allEvents } = await supabase.from("events").select("user_id");

  const hoursByUser = new Map<string, number>();
  (approved ?? []).forEach((e: { user_id: string; hours: number }) => {
    hoursByUser.set(e.user_id, (hoursByUser.get(e.user_id) ?? 0) + Number(e.hours));
  });
  const countsByUser = new Map<string, number>();
  (allEvents ?? []).forEach((e: { user_id: string }) => {
    countsByUser.set(e.user_id, (countsByUser.get(e.user_id) ?? 0) + 1);
  });

  const rows: MemberRow[] = ((profiles as Profile[] | null) ?? []).map((p) => ({
    ...p,
    approved_hours: hoursByUser.get(p.id) ?? 0,
    total_events: countsByUser.get(p.id) ?? 0,
  }));

  return (
    <div className="tracker-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--surface-2)] text-[color:var(--muted-2)] text-left text-xs uppercase tracking-wider">
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Grade</th>
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Approved Hrs</th>
            <th className="px-4 py-3 font-semibold">Events</th>
            <th className="px-4 py-3 font-semibold text-right"></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
              >
                No members yet.
              </td>
            </tr>
          )}
          {rows.map((p) => (
            <tr
              key={p.id}
              className="border-t border-[var(--border-2)]"
            >
              <td className="px-4 py-3 font-medium text-[color:var(--color-brand-ink)] dark:text-white">
                {p.full_name || "(no name)"}
                {p.is_admin && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-brand-navy text-white text-[10px] font-bold uppercase">
                    Admin
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-[color:var(--muted)] dark:text-slate-300">
                {p.grade ?? "—"}
              </td>
              <td className="px-4 py-3 text-[color:var(--muted)] dark:text-slate-300 capitalize">
                {p.role}
              </td>
              <td className="px-4 py-3 text-[color:var(--muted)] dark:text-slate-300">
                {formatHours(p.approved_hours)}
              </td>
              <td className="px-4 py-3 text-[color:var(--muted)] dark:text-slate-300">
                {p.total_events}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/members/${p.id}`}
                  className="text-sm font-semibold text-brand-navy dark:text-brand-orange hover:underline"
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
