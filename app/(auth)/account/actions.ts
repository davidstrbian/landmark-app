"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    // "local" signs out this browser only, not the account's other devices.
    await supabase.auth.signOut({ scope: "local" });
  }
  redirect("/");
}
