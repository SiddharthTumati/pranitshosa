"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import {
  approveEventAction,
  rejectEventAction,
  deleteEventAction,
  reopenEventAction,
} from "@/app/actions/events";
import { formatDate, formatHours, type EventRow } from "@/lib/types";

type Props = {
  event: EventRow & { profile?: { full_name: string; grade: number | null } };
};

export function EventReviewCard({ event }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const doAction = (fn: () => Promise<void>) => {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Action failed");
      }
    });
  };

  return (
    <div className="tracker-card p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
      {event.photo_url ? (
        <a
          href={event.photo_url}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 relative w-full sm:w-48 h-44 sm:h-36 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600"
        >
          <Image
            src={event.photo_url}
            alt={`${event.name} photo`}
            fill
            sizes="(max-width: 640px) 100vw, 192px"
            className="object-cover"
            unoptimized={false}
          />
        </a>
      ) : (
        <div className="shrink-0 w-full sm:w-48 h-44 sm:h-36 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
          No photo
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-50">
              {event.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              {event.profile?.full_name ?? "Student"}
              {event.profile?.grade ? ` · ${event.profile.grade}th` : ""}
            </p>
          </div>
          <StatusBadge status={event.status} />
        </div>

        <dl className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          <Info label="Date" value={formatDate(event.event_date)} />
          <Info label="Semester" value={event.semester} className="capitalize" />
          <Info label="Hours" value={formatHours(Number(event.hours))} />
          <Info label="Category" value={event.category} />
        </dl>

        {event.notes && (
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2">
            <span className="font-semibold">Notes: </span>
            {event.notes}
          </p>
        )}

        {event.rejection_reason && event.status === "rejected" && (
          <p className="mt-3 text-sm text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
            <span className="font-semibold">Rejected: </span>
            {event.rejection_reason}
          </p>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {showReject ? (
          <div className="mt-4">
            <textarea
              placeholder="Reason for rejection (shown to student)"
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="form-input resize-y"
            />
            <div className="mt-2 flex gap-2">
              <button
                disabled={isPending}
                onClick={() =>
                  doAction(async () => {
                    await rejectEventAction(event.id, reason);
                    setShowReject(false);
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
              >
                Confirm reject
              </button>
              <button
                onClick={() => {
                  setShowReject(false);
                  setReason("");
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {event.status !== "approved" && (
              <button
                disabled={isPending}
                onClick={() => doAction(() => approveEventAction(event.id))}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
              >
                Approve
              </button>
            )}
            {event.status !== "rejected" && (
              <button
                disabled={isPending}
                onClick={() => setShowReject(true)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                Reject
              </button>
            )}
            {event.status !== "pending" && (
              <button
                disabled={isPending}
                onClick={() => doAction(() => reopenEventAction(event.id))}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Re-open
              </button>
            )}
            <button
              disabled={isPending}
              onClick={() => {
                if (
                  confirm(
                    "Delete this event permanently? This cannot be undone."
                  )
                ) {
                  doAction(() => deleteEventAction(event.id));
                }
              }}
              className="ml-auto px-3 py-1.5 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd
        className={`font-medium text-slate-900 dark:text-slate-100 ${className}`}
      >
        {value}
      </dd>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "pending" | "approved" | "rejected";
}) {
  const map = {
    pending:
      "bg-amber-100 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 border-amber-300 dark:border-amber-700",
    approved:
      "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700",
    rejected:
      "bg-red-100 dark:bg-red-950/40 text-red-950 dark:text-red-100 border-red-300 dark:border-red-700",
  } as const;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border capitalize ${map[status]}`}
    >
      {status}
    </span>
  );
}
