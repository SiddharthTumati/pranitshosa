import type { ReactNode } from "react";

/**
 * Editorial two-column shell for log / edit event flows.
 * Left rail: MRHS navy + Mavericks orange (chapter colors).
 */
export function EventFormPageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="tracker-card overflow-hidden">
      <div className="grid lg:grid-cols-[minmax(0,15.5rem)_1fr]">
        <aside className="bg-brand-orange-soft dark:bg-brand-navy/25 border-b lg:border-b-0 lg:border-r border-[var(--border-1)] p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-navy dark:text-white">
            MRHS HOSA
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand-orange">
            Mavericks
          </p>
          <p className="mt-4 text-sm text-[color:var(--muted)] dark:text-slate-300 leading-relaxed">
            Royal blue and orange are the chapter colors. Hours only count
            after an officer approves the event.
          </p>
          <div
            className="mt-6 hidden lg:block h-1 w-14 bg-brand-navy dark:bg-brand-orange"
            aria-hidden
          />
        </aside>
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[color:var(--color-brand-ink)] dark:text-white">
            {title}
          </h1>
          <div className="mt-1 text-sm text-[color:var(--muted)] dark:text-slate-300">
            {subtitle}
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
