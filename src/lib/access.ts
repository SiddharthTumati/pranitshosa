/**
 * Open site: no sign-in UI; sessions are anonymous or any existing Supabase session.
 * Everyone gets admin UI and (with migration 0006) is_admin in the database.
 */
export const AUTH_OPEN = true;

export function demoDisplayName(): string {
  return process.env.NEXT_PUBLIC_OPEN_ACCESS_NAME?.trim() || "Chapter member";
}
