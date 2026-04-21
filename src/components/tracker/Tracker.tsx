import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { EventRow, Profile } from "@/lib/types";
import {
  HOSA_MINIMUM_HOURS,
  OFFICER_MINIMUM_HOURS,
  canEdit,
  formatDate,
  formatHours,
} from "@/lib/types";

type Props = {
  profile: Profile;
  events: EventRow[];
  chapterName: string;
  officerEmail?: string;
  viewerIsAdmin?: boolean;
  viewingOther?: boolean;
  printMode?: boolean;
};

function sumHours(rows: EventRow[]): number {
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

function GoalItem({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-200 last:border-b-0 md:border-b-0">
      <div
        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
          met ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
        }`}
      >
        {met ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12.5l4.5 4.5L19 7"
            />
          </svg>
        ) : null}
      </div>
      <span className="text-sm text-slate-700">{label}</span>
    </div>
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

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-10">
      <div className="tracker-card print-surface p-4 sm:p-8">
        {/* Navy header */}
        <div className="relative rounded-2xl bg-brand-navy text-white p-5 sm:p-7 overflow-hidden">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                {chapterName} · Service Tracker
              </p>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold leading-tight truncate">
                {profile.full_name || "Student Name"}
              </h1>
              <p className="mt-1 text-sm text-white/80">
                {profile.grade ? `${ordinal(profile.grade)} Grade · ` : ""}
                {isOfficer ? "Officer" : "Member"} · {yearLabel}
              </p>
            </div>
            <div className="hidden sm:flex w-16 h-16 rounded-full bg-white items-center justify-center shrink-0 shadow-md">
              <Logo className="w-10 h-10" />
            </div>
          </div>
        </div>

        {/* Stat row */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Hours" value={formatNum(totalHours)} />
          <StatCard label="Events Participated In" value={String(eventCount)} />
          <StatCard
            label="Meets HOSA Requirements?"
            value={<Check met={memberReqMet} />}
          />
          <StatCard
            label="Officer Requirements Met?"
            value={<Check met={officerReqMet} />}
          />
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
        <div className="rounded-xl overflow-x-auto border border-slate-200 -mx-1 sm:mx-0">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="bg-brand-navy text-white">
                <th className="text-left font-semibold px-4 py-3">Event</th>
                <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">
                  Semester
                </th>
                <th className="text-left font-semibold px-4 py-3">Hours</th>
                <th className="text-left font-semibold px-4 py-3">Category</th>
                {!printMode && (
                  <th className="text-right font-semibold px-4 py-3 no-print">
                    {""}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
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
                <tr
                  key={evt.id}
                  className={
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                  }
                >
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">
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
                    <div className="text-xs text-slate-500 mt-0.5">
                      {formatDate(evt.event_date)}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle capitalize hidden sm:table-cell text-slate-700">
                    {evt.semester}
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-700">
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
              ))}
            </tbody>
          </table>
        </div>

        {(pending.length > 0 || rejected.length > 0) && !printMode && (
          <p className="mt-3 text-xs text-slate-500">
            {pending.length > 0 && (
              <>
                {pending.length} pending event{pending.length === 1 ? "" : "s"}{" "}
                — hours count once approved by an officer.
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

        {/* Goals checklist */}
        <SectionLabel>Goals Checklist</SectionLabel>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="grid md:grid-cols-2">
            <GoalItem
              label={`Fall HOSA minimum (${HOSA_MINIMUM_HOURS} hrs)`}
              met={fallMemberMet}
            />
            <GoalItem
              label={`Spring HOSA minimum (${HOSA_MINIMUM_HOURS} hrs)`}
              met={springMemberMet}
            />
            <GoalItem
              label={`Fall officer threshold (${OFFICER_MINIMUM_HOURS} hrs)`}
              met={fallOfficerMet}
            />
            <GoalItem
              label={`Spring officer threshold (${OFFICER_MINIMUM_HOURS} hrs)`}
              met={springOfficerMet}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-dashed border-slate-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-brand-orange">
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
              <>Questions? Email the Community Service Director</>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 sm:px-4 flex flex-col items-center text-center">
      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-navy leading-tight">
        {label}
      </p>
      <div className="mt-1.5 text-2xl sm:text-3xl font-bold text-brand-navy min-h-[2rem] sm:min-h-[2.25rem] flex items-center">
        {value}
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
    <div className="rounded-xl bg-brand-orange-soft px-5 py-4 border border-brand-navy/12">
      <p className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/75">
        {title}
      </p>
      <p className="mt-1 text-3xl font-bold text-brand-navy">
        ~{formatNum(hours)} hrs
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-7 mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-700">
      {children}
    </h2>
  );
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(1);
}
