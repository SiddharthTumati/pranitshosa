/**
 * Split a chapter string like "Marvin Ridge High School HOSA" into
 * { school, hosa } for two-line lockups. Falls back gracefully.
 */
export function parseChapterMrhsHosa(full: string): {
  school: string;
  hosa: string;
} {
  const trimmed = full.trim();
  const lower = trimmed.toLowerCase();
  const idx = lower.lastIndexOf("hosa");
  if (idx === -1) {
    return { school: trimmed, hosa: "HOSA" };
  }
  const school = trimmed.slice(0, idx).trim().replace(/\s+$/, "");
  const hosa = trimmed.slice(idx).trim() || "HOSA";
  return { school: school || trimmed, hosa };
}

export function defaultChapterName(): string {
  return process.env.NEXT_PUBLIC_CHAPTER_NAME ?? "Marvin Ridge High School HOSA";
}
