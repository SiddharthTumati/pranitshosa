import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";

/**
 * Ensures a `profiles` row exists for this auth user (trigger missed, or
 * self-heal after RLS/migration fixes). Safe to call on every dashboard load.
 */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User
): Promise<Profile | null> {
  const { data: existing, error: readErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  if (readErr) {
    console.error("ensureProfile read error", readErr.message);
  }
  if (existing) return existing;

  const email = user.email ?? "";
  const { data: isAdmin, error: rpcErr } = await supabase.rpc(
    "email_is_admin",
    { p_email: email }
  );

  if (rpcErr) {
    console.error("ensureProfile email_is_admin RPC error", rpcErr.message);
  }

  const adminFlag = rpcErr ? false : Boolean(isAdmin);

  const { error: insertErr } = await supabase.from("profiles").insert({
    id: user.id,
    full_name:
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      "",
    is_admin: adminFlag,
  });

  if (insertErr) {
    console.error("ensureProfile insert error", insertErr.message, insertErr);
    return null;
  }

  const { data: refetched, error: refetchErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  if (refetchErr) {
    console.error("ensureProfile refetch error", refetchErr.message);
  }

  return refetched;
}
