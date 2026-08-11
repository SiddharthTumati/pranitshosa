"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AUTH_OPEN } from "@/lib/access";

export async function signOutAction() {
  if (AUTH_OPEN) {
    // Open mode: stay on the site (anon session may refresh)
    redirect("/dashboard");
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/dashboard");
}
