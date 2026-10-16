"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DISPLAY_NAME_MAX, readString, type FormState } from "@/lib/auth-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function updateDisplayName(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured) return { error: "Sign-in isn't set up yet." };
  const name = readString(formData, "displayName").trim();
  if (name.length > DISPLAY_NAME_MAX)
    return { error: `Use at most ${DISPLAY_NAME_MAX} characters.` };

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (!userId) redirect("/login?next=/account");

  // RLS only lets a user update their own row; the filter picks it.
  const { data: rows, error } = await supabase
    .from("profiles")
    .update({ display_name: name || null })
    .eq("id", userId)
    .select("id");
  if (error || !rows?.length) return { error: "Couldn't save your name. Please try again." };
  revalidatePath("/account");
  return { message: name ? "Saved." : "Name removed." };
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    // "local" signs out this browser only, not the account's other devices.
    await supabase.auth.signOut({ scope: "local" });
  }
  redirect("/");
}
