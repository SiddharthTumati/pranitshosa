"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { bulkApproveEventIdsAction } from "@/app/actions/events";
import { EventReviewCard } from "@/components/admin/EventReviewCard";
import type { EventWithProfile } from "@/lib/types";

type PendingEvent = EventWithProfile;

export function PendingQueueClient({ events }: { events: PendingEvent[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const allSelected =
    events.length > 0 && selected.size === events.length;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(events.map((e) => e.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function bulkApprove() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (
      !confirm(
        `Approve ${ids.length} event${ids.length === 1 ? "" : "s"}? Each will show as approved with your name and the current time.`
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await bulkApproveEventIdsAction(ids);
        setSelected(new Set());
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Bulk approve failed");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--border-1)] bg-[var(--surface-2)] px-3 py-2.5 no-print">
        <label className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-brand-ink)] dark:text-slate-200 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="w-4 h-4 rounded border-[var(--border-1)]"
          />
          Select all on this page
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {error && (
            <span className="text-sm text-red-700 dark:text-red-300">
              {error}
            </span>
          )}
          <button
            type="button"
            disabled={isPending || selected.size === 0}
            onClick={bulkApprove}
            className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending
              ? "Approving…"
              : `Approve selected (${selected.size})`}
          </button>
        </div>
      </div>

      {events.map((evt) => (
        <div key={evt.id} className="flex gap-3 items-start">
          <label className="shrink-0 pt-5 cursor-pointer no-print">
            <input
              type="checkbox"
              checked={selected.has(evt.id)}
              onChange={() => toggleOne(evt.id)}
              className="w-4 h-4 rounded border-[var(--border-1)]"
            />
            <span className="sr-only">Select {evt.name}</span>
          </label>
          <div className="flex-1 min-w-0">
            <EventReviewCard event={evt} />
          </div>
        </div>
      ))}
    </div>
  );
}
