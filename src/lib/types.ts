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
  "Blood Drive": "bg-orange-300 text-orange-950",
  Speaker: "bg-orange-300 text-orange-950",
  Community: "bg-orange-300 text-orange-950",
  Social: "bg-orange-300 text-orange-950",
  "Health Ed.": "bg-orange-300 text-orange-950",
  Other: "bg-orange-200 text-orange-950",
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

export function canEdit(row: Pick<EventRow, "status" | "created_at">): boolean {
  if (row.status !== "pending") return false;
  const createdAt = new Date(row.created_at).getTime();
  return Date.now() - createdAt < EDIT_WINDOW_HOURS * 60 * 60 * 1000;
}

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (Number.isInteger(hours)) return `${hours} ${hours === 1 ? "hr" : "hrs"}`;
  return `${hours} hrs`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso + (iso.length <= 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
