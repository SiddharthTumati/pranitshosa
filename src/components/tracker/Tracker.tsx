import { Fragment } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { EventAuditTrail } from "@/components/tracker/EventAuditTrail";
import { chapterTrackerFootnote } from "@/lib/chapterConfig";
import { parseChapterMrhsHosa } from "@/lib/mrhsBranding";
import type { EventRowWithAudit, Profile } from "@/lib/types";
import {
  HOSA_MINIMUM_HOURS,
  OFFICER_MINIMUM_HOURS,
  canEdit,
  formatDate,
  formatDateTime,
  formatHours,
} from "@/lib/types";

type Props = {
  profile: Profile;
  events: EventRowWithAudit[];
  chapterName: string;
  officerEmail?: string;
  viewerIsAdmin?: boolean;
  viewingOther?: boolean;
  printMode?: boolean;
  /** When set with printMode, renders a packet cover (e.g. from export page). */
  packetGeneratedAt?: string | null;
};

function sumHours(rows: EventRowWithAudit[]): number {
  return rows.reduce((acc, r) => acc + Number(r.hours), 0);
}

function Pill({
  children,
  tone = "orange",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "orange" | "slate" | "amber" | "red" | "emerald";
  className?: string;
}) {
  const tones = {
    orange: "bg-brand-orange-pill text-brand-ink",
    slate: "bg-slate-200 text-slate-800",
    amber: "bg-amber-100 text-amber-900 border border-amber-300",
    red: "bg-red-100 text-red-900 border border-red-300",
    emerald: "bg-emerald-100 text-emerald-900 border border-emerald-300",
  } as const;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

function Check({ met }: { met: boolean }) {
  if (met) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-emerald-500"
        aria-label="Met"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 12.5l4.5 4.5L19 7"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8 text-slate-300" aria-label="Not met">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        d="M7 7l10 10M17 7L7 17"
      />
    </svg>
  );
}

export function Tracker({
  profile,
  events,
  chapterName,
  officerEmail,
  viewerIsAdmin = false,
  viewingOther = false,
  printMode = false,
  packetGeneratedAt = null,
}: Props) {
  const approved = events.filter((e) => e.status === "approved");
  const pending = events.filter((e) => e.status === "pending");
  const rejected = events.filter((e) => e.status === "rejected");

  const totalHours = sumHours(approved);
  const fallHours = sumHours(approved.filter((e) => e.semester === "fall"));
  const springHours = sumHours(approved.filter((e) => e.semester === "spring"));

  const isOfficer = profile.role === "officer";
  const fallMemberMet = fallHours >= HOSA_MINIMUM_HOURS;
  const springMemberMet = springHours >= HOSA_MINIMUM_HOURS;
  const fallOfficerMet = fallHours >= OFFICER_MINIMUM_HOURS;
  const springOfficerMet = springHours >= OFFICER_MINIMUM_HOURS;

  const memberReqMet = fallMemberMet && springMemberMet;
  const officerReqMet = fallOfficerMet && springOfficerMet;

  const yearLabel = profile.year_label || "2025–2026";
  const eventCount = approved.length;
  const { school: chapterSchool, hosa: chapterHosa } =
    parseChapterMrhsHosa(chapterName);
  const colSpan = printMode ? 4 : 5;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-10">
      {printMode && packetGeneratedAt && (
        <div className="tracker-card print-surface p-6 sm:p-8 mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--muted-2)]">
            Community service verification
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[color:var(--color-brand-ink)]">
            Packet cover
          </h2>
          <dl className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted-2)]">
                Chapter
              </dt>
              <dd className="font-medium text-[color:var(--color-brand-ink)]">
                {chapterName}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted-2)]">
                Member
              </dt>
              <dd className="font-medium text-[color:var(--color-brand-ink)]">
                {profile.full_name?.trim() || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted-2)]">
                Program year
              </dt>
              <dd className="font-medium text-[color:var(--color-brand-ink)]">
                {yearLabel}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted-2)]">
                Generated
              </dt>
              <dd className="font-medium text-[color:var(--color-brand-ink)]">
                {formatDateTime(packetGeneratedAt)}
              </dd>
            </div>
          </dl>
          {officerEmail && (
            <p className="mt-4 text-sm text-[color:var(--muted)]">
              Chapter contact:{" "}
              <a href={`mailto:${officerEmail}`} className="font-semibold underline">
                {officerEmail}
              </a>
            </p>
          )}
          <p className="mt-4 text-xs text-[color:var(--muted-2)] leading-relaxed">
            The following pages list approved service events and semester totals
            as recorded in this tracker. Approved hours match the totals in the
            summary section.
          </p>
        </div>
      )}

      <div
        className={`tracker-card print-surface p-4 sm:p-8 ${
          printMode && packetGeneratedAt ? "print-page-break" : ""
        }`}
      >
        {/* Editorial header grid */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-10">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--muted-2)]">
              {chapterSchool}{" "}
              <span className="text-[color:var(--color-brand-navy)] dark:text-slate-100">
                {chapterHosa}
              </span>
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[color:var(--color-brand-ink)] dark:text-white truncate">
              {profile.full_name?.trim() || "Insert Name Here"}
            </h1>
            <p className="mt-1 text-sm text-[color:var(--muted)] dark:text-slate-300">
              {profile.grade ? `${ordinal(profile.grade)} Grade · ` : ""}
              {isOfficer ? "Officer" : "Member"} · {yearLabel}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Logo className="h-9" variant="onLight" />
              <span className="text-xs text-[color:var(--muted)] dark:text-slate-400">
                Approved hours only. Pending doesn’t count yet.
              </span>
            </div>
          </div>

          {/* Metrics column with a purposeful vertical rule */}
          <div className="lg:pl-10 lg:border-l lg:border-[var(--border-2)]">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
              <Metric label="Approved total" value={formatHours(totalHours)} />
              <Metric label="Approved events" value={String(eventCount)} />
              <Metric
                label="HOSA minimum met"
                value={<Check met={memberReqMet} />}
                compact
              />
              <Metric
                label="Officer minimum met"
                value={<Check met={officerReqMet} />}
                compact
              />
            </dl>
          </div>
        </div>

        {/* Semester summary */}
        <SectionLabel>Semester Summary</SectionLabel>
        <div className="grid md:grid-cols-2 gap-3">
          <SemesterCard
            title="Fall Semester"
            hours={fallHours}
            memberMet={fallMemberMet}
            officerMet={fallOfficerMet}
          />
          <SemesterCard
            title="Spring Semester"
            hours={springHours}
            memberMet={springMemberMet}
            officerMet={springOfficerMet}
          />
        </div>

        {/* Event Log */}
        <SectionLabel>Event Log</SectionLabel>
        <div className="overflow-x-auto border border-[var(--border-1)] rounded-[var(--radius)] -mx-1 sm:mx-0">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="bg-[var(--surface-2)] text-[color:var(--muted-2)]">
                <th className="text-left font-semibold px-4 py-3 border-b border-[var(--border-1)]">
                  Event
                </th>
                <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">
                  Semester
                </th>
                <th className="text-left font-semibold px-4 py-3 border-b border-[var(--border-1)]">
                  Hours
                </th>
                <th className="text-left font-semibold px-4 py-3 border-b border-[var(--border-1)]">
                  Category
                </th>
                {!printMode && (
                  <th className="text-right font-semibold px-4 py-3 no-print border-b border-[var(--border-1)]">
                    {""}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr>
                  <td
                    colSpan={colSpan}
                    className="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
                  >
                    No events yet.{" "}
                    {!viewingOther && (
                      <Link
                        href="/dashboard/add"
                        className="text-brand-navy font-semibold hover:underline no-print"
                      >
                        Log your first event →
                      </Link>
                    )}
                  </td>
                </tr>
              )}
              {events.map((evt, idx) => (
                <Fragment key={evt.id}>
                <tr
                  className={
                    idx % 2 === 0
                      ? "bg-white dark:bg-slate-900/40"
                      : "bg-slate-50/70 dark:bg-slate-800/35"
                  }
                >
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {evt.name}
                      </span>
                      {evt.status === "pending" && (
                        <Pill tone="amber">Pending</Pill>
                      )}
                      {evt.status === "rejected" && (
                        <Pill tone="red">Rejected</Pill>
                      )}
                      {evt.photo_url && (
                        <span
                          className="text-slate-400"
                          title="Photo attached"
                          aria-label="Has photo"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4">
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              d="M3 7a2 2 0 0 1 2-2h3l2-2h4l2 2h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                            />
                            <circle
                              cx="12"
                              cy="13"
                              r="3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {formatDate(evt.event_date)}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle capitalize hidden sm:table-cell text-slate-700 dark:text-slate-300">
                    {evt.semester}
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-700 dark:text-slate-300">
                    {formatHours(Number(evt.hours))}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <Pill>{evt.category}</Pill>
                  </td>
                  {!printMode && (
                    <td className="px-4 py-3 align-middle text-right no-print">
                      {canEdit(evt) && !viewingOther && (
                        <Link
                          href={`/dashboard/edit/${evt.id}`}
                          className="text-xs font-semibold text-brand-navy hover:underline"
                        >
                          Edit
                        </Link>
                      )}
                      {viewerIsAdmin && viewingOther && (
                        <Link
                          href={`/admin?focus=${evt.id}`}
                          className="text-xs font-semibold text-brand-orange hover:underline"
                        >
                          Review
                        </Link>
                      )}
                    </td>
                  )}
                </tr>
                {!printMode && (
                  <tr
                    className={
                      idx % 2 === 0
                        ? "bg-white dark:bg-slate-900/40"
                        : "bg-slate-50/70 dark:bg-slate-800/35"
                    }
                  >
                    <td
                      colSpan={colSpan}
                      className="px-4 pb-3 pt-0 border-t border-[var(--border-2)] align-top"
                    >
                      <EventAuditTrail event={evt} />
                    </td>
                  </tr>
                )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {(pending.length > 0 || rejected.length > 0) && !printMode && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {pending.length > 0 && (
              <>
                {pending.length} pending — not in your hour total until
                approved.
              </>
            )}
            {rejected.length > 0 && (
              <>
                {" "}
                {rejected.length} rejected.
              </>
            )}
          </p>
        )}

        {printMode && (
          <div className="mt-10 pt-6 border-t border-slate-300 text-[color:var(--color-brand-ink)]">
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--muted-2)]">
              Signatures
            </p>
            <p className="text-xs text-[color:var(--muted)] mt-1 mb-6">
              Optional — use if your packet requires advisor or officer sign-off.
            </p>
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 text-sm">
              <div>
                <p className="text-[color:var(--muted-2)] mb-1">Student</p>
                <div className="h-10 border-b-2 border-[color:var(--color-brand-ink)]" />
              </div>
              <div>
                <p className="text-[color:var(--muted-2)] mb-1">
                  Advisor or chapter officer
                </p>
                <div className="h-10 border-b-2 border-[color:var(--color-brand-ink)]" />
              </div>
            </div>
            <p className="mt-6 text-xs text-[color:var(--muted-2)] leading-relaxed">
              By signing, the parties acknowledge that submitted entries have been
              reviewed against chapter expectations.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-dashed border-slate-300 dark:border-slate-600 flex flex-col gap-2 text-sm">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold">Note:</span>{" "}
            {chapterTrackerFootnote()}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-brand-orange">
          <span>
            {chapterName} · {yearLabel} Service Tracker
          </span>
          <span>
            {officerEmail ? (
              <>
                Questions? Email{" "}
                <a
                  href={`mailto:${officerEmail}`}
                  className="font-semibold underline"
                >
                  {officerEmail}
                </a>
              </>
            ) : (
              <>Ask a chapter officer if something looks wrong.</>
            )}
          </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SemesterCard({
  title,
  hours,
  memberMet,
  officerMet,
}: {
  title: string;
  hours: number;
  memberMet: boolean;
  officerMet: boolean;
}) {
  return (
    <div className="rounded-xl bg-brand-orange-soft dark:bg-slate-800/90 dark:border-slate-600 px-5 py-4 border border-brand-navy/12">
      <p className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/75 dark:text-slate-300">
        {title}
      </p>
      <p className="mt-1 text-3xl font-bold text-brand-navy dark:text-white">
        {formatHours(hours)}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <Pill tone={memberMet ? "emerald" : "orange"}>
          HOSA minimum ({HOSA_MINIMUM_HOURS} hr)
          {memberMet ? " ✓" : ""}
        </Pill>
        <Pill tone={officerMet ? "emerald" : "orange"}>
          Officer ({OFFICER_MINIMUM_HOURS} hr)
          {officerMet ? " ✓" : ""}
        </Pill>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted-2)]">
        {label}
      </dt>
      <dd
        className={`mt-1 font-semibold text-[color:var(--color-brand-ink)] dark:text-white ${
          compact ? "text-xl" : "text-2xl"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-7 mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-700 dark:text-slate-400">
      {children}
    </h2>
  );
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
