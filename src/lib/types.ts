export type EventStatus = "pending" | "approved" | "rejected";
export type Semester = "fall" | "spring";
export type Role = "member" | "officer";
export type Category =
  | "Blood Drive"
  | "Speaker"
  | "Community"
  | "Social"
  | "Health Ed."
  | "Other";

export const CATEGORIES: Category[] = [
  "Blood Drive",
  "Speaker",
  "Community",
  "Social",
  "Health Ed.",
  "Other",
];

export const SEMESTERS: Semester[] = ["fall", "spring"];

export const CATEGORY_COLORS: Record<Category, string> = {
  "Blood Drive": "bg-brand-orange-pill text-brand-ink",
  Speaker: "bg-brand-orange-pill text-brand-ink",
  Community: "bg-brand-orange-pill text-brand-ink",
  Social: "bg-brand-orange-pill text-brand-ink",
  "Health Ed.": "bg-brand-orange-pill text-brand-ink",
  Other: "bg-brand-orange-soft text-brand-ink border border-brand-navy/15",
};

export type Profile = {
  id: string;
  full_name: string;
  grade: number | null;
  role: Role;
  is_admin: boolean;
  year_label: string;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: string;
  user_id: string;
  name: string;
  event_date: string;
  semester: Semester;
  hours: number;
  category: Category;
  photo_url: string | null;
  photo_path: string | null;
  notes: string | null;
  status: EventStatus;
  rejection_reason: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EventWithProfile = EventRow & {
  profile: Pick<Profile, "full_name" | "grade">;
};

export const HOSA_MINIMUM_HOURS = 4;
export const OFFICER_MINIMUM_HOURS = 6;
export const EDIT_WINDOW_HOURS = 24;

/** Allowed durations when logging events: 1 minute, then 5–480 in steps of 5. */
export const DURATION_MINUTE_CHOICES: readonly number[] = (() => {
  const out: number[] = [1];
  for (let m = 5; m <= 8 * 60; m += 5) out.push(m);
  return out;
})();

export function snapMinutesToChoice(totalMin: number): number {
  const clamped = Math.max(1, Math.round(totalMin));
  let best = DURATION_MINUTE_CHOICES[0];
  let bestDiff = Infinity;
  for (const m of DURATION_MINUTE_CHOICES) {
    const d = Math.abs(m - clamped);
    if (d < bestDiff) {
      bestDiff = d;
      best = m;
    }
  }
  return best;
}

/** Store as fractional hours in Postgres (numeric). */
export function minutesToDbHours(minutes: number): number {
  return Math.round((minutes / 60) * 10000) / 10000;
}

/** Short label for duration `<select>` options. */
export function formatDurationChoiceLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const r = minutes % 60;
  if (r === 0) return `${h} ${h === 1 ? "hr" : "hrs"}`;
  return `${h}h ${r}m`;
}

export function canEdit(row: Pick<EventRow, "status" | "created_at">): boolean {
  if (row.status !== "pending") return false;
  const createdAt = new Date(row.created_at).getTime();
  return Date.now() - createdAt < EDIT_WINDOW_HOURS * 60 * 60 * 1000;
}

export function formatHours(hours: number): string {
  const mins = Math.round(hours * 60);
  if (mins <= 0) return "0 min";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (m === 0) return `${h} ${h === 1 ? "hr" : "hrs"}`;
  return `${h} hr ${m} min`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso + (iso.length <= 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
