/**
 * Single source for chapter-facing copy and optional env overrides.
 * Keeps deploys swappable for another school without hunting strings in components.
 */
import { defaultChapterName, parseChapterMrhsHosa } from "@/lib/mrhsBranding";

export function chapterName(): string {
  return defaultChapterName();
}

/** Short badge above headings (e.g. MRHS HOSA). Override per deploy. */
export function chapterBrandKicker(): string {
  return process.env.NEXT_PUBLIC_CHAPTER_BRAND_KICKER?.trim() || "MRHS HOSA";
}

/** Mascot / spirit line under the kicker in form shells. */
export function chapterMascotLine(): string {
  return process.env.NEXT_PUBLIC_CHAPTER_MASCOT_LINE?.trim() || "Mavericks";
}

/**
 * One sentence for auth / marketing. Maps to product behavior (submit → approve → PDF).
 */
export function chapterProductTagline(): string {
  return (
    process.env.NEXT_PUBLIC_PRODUCT_TAGLINE?.trim() ||
    "Submit once with optional photo proof; officers approve; export the same view to PDF for your packet."
  );
}

/** Trust / audit bullets shown on sign-in and sign-up. */
export function chapterTrustBullets(): readonly string[] {
  const raw = process.env.NEXT_PUBLIC_TRUST_BULLETS?.trim();
  if (raw) {
    return raw.split("|").map((s) => s.trim()).filter(Boolean);
  }
  return [
    "Hours only count after an officer approves — pending time never inflates your total.",
    "Optional photo proof stays attached to each event for advisors and competitions.",
    "You can see when something was submitted, approved, or rejected — including rejection reasons.",
    "Students cannot delete rows; only admins can, so the log stays audit-friendly.",
  ] as const;
}

export function chapterYearLabel(): string {
  return process.env.NEXT_PUBLIC_YEAR_LABEL?.trim() || "2025–2026";
}

export function chapterOfficerEmail(): string | undefined {
  const e = process.env.NEXT_PUBLIC_COMMUNITY_SERVICE_EMAIL?.trim();
  return e || undefined;
}

export function chapterLoginDescription(): string {
  return (
    process.env.NEXT_PUBLIC_LOGIN_DESCRIPTION?.trim() ||
    "Sign in to log events, see approval status and timestamps on each submission, and export to PDF when you need a packet."
  );
}

export function chapterSignupDescription(): string {
  return (
    process.env.NEXT_PUBLIC_SIGNUP_DESCRIPTION?.trim() ||
    "School email is fine. Officers approve hours (and optional photos) before they count. Rejection reasons are shown to you."
  );
}

/** App / browser metadata description (plain text). */
export function chapterMetaDescription(): string {
  const name = chapterName();
  return (
    process.env.NEXT_PUBLIC_APP_META_DESCRIPTION?.trim() ||
    `${name} — log service events with photo proof, officer approval, and printable verification.`
  );
}

/** Shown under the event log on the tracker (student-facing). */
export function chapterTrackerFootnote(): string {
  return (
    process.env.NEXT_PUBLIC_TRACKER_FOOTNOTE?.trim() ||
    "Pending hours are not included in approved totals. Each event shows when it was submitted and, after review, who approved or rejected it and when."
  );
}

/** Two-line lockup for shells (school name + HOSA). */
export function chapterLockup() {
  return parseChapterMrhsHosa(chapterName());
}
