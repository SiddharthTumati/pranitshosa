import type { EventRowWithAudit } from "@/lib/types";
import { formatDateTime } from "@/lib/types";

export function EventAuditTrail({ event }: { event: EventRowWithAudit }) {
  const approverName = event.approver?.full_name?.trim();
  const decisionAt = event.approved_at
    ? formatDateTime(event.approved_at)
    : null;

  return (
    <div className="text-xs text-[color:var(--muted)] dark:text-slate-400 leading-relaxed">
      <span className="font-semibold text-[color:var(--muted-2)] dark:text-slate-500">
        Review trail:
      </span>{" "}
      <span className="text-[color:var(--color-brand-ink)] dark:text-slate-200">
        Submitted {formatDateTime(event.created_at)}
      </span>
      {event.status === "pending" && (
        <>
          {" · "}
          <span className="text-amber-800 dark:text-amber-200">
            Awaiting officer review
          </span>
        </>
      )}
      {event.status === "approved" && (
        <>
          {" · "}
          <span className="text-emerald-800 dark:text-emerald-200">
            Approved
            {decisionAt ? ` ${decisionAt}` : ""}
            {approverName ? ` by ${approverName}` : ""}
          </span>
        </>
      )}
      {event.status === "rejected" && (
        <>
          {" · "}
          <span className="text-red-800 dark:text-red-200">
            Rejected
            {decisionAt ? ` ${decisionAt}` : ""}
            {approverName ? ` by ${approverName}` : ""}
          </span>
          {event.rejection_reason?.trim() ? (
            <>
              {" — "}
              <span className="italic">{event.rejection_reason.trim()}</span>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
