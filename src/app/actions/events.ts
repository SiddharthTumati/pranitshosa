"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single<{ is_admin: boolean }>();
  if (!profile?.is_admin) throw new Error("Admin only");
  return { supabase, user };
}

export async function approveEventAction(eventId: string) {
  const { supabase, user } = await requireAdmin();
  const { error } = await supabase
    .from("events")
    .update({
      status: "approved",
      approved_by: user.id,
      approved_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq("id", eventId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function rejectEventAction(eventId: string, reason: string) {
  const { supabase, user } = await requireAdmin();
  const { error } = await supabase
    .from("events")
    .update({
      status: "rejected",
      approved_by: user.id,
      approved_at: new Date().toISOString(),
      rejection_reason: reason || null,
    })
    .eq("id", eventId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function reopenEventAction(eventId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("events")
    .update({
      status: "pending",
      approved_by: null,
      approved_at: null,
      rejection_reason: null,
    })
    .eq("id", eventId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function deleteEventAction(eventId: string) {
  const { supabase } = await requireAdmin();
  const { data: evt } = await supabase
    .from("events")
    .select("photo_path")
    .eq("id", eventId)
    .single<{ photo_path: string | null }>();
  if (evt?.photo_path) {
    await supabase.storage.from("event-photos").remove([evt.photo_path]);
  }
  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function updateProfileAction(
  profileId: string,
  patch: { role?: "member" | "officer"; is_admin?: boolean; grade?: number | null; full_name?: string; year_label?: string }
) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", profileId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/members");
}
