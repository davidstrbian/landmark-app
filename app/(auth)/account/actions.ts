"use server";

import { createClient as createPlainClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authErrorMessage } from "@/lib/auth-errors";
import { DELETE_PHRASE, checkEmail, checkPassword, readString, type FormState } from "@/lib/auth-form";
import { AVATAR_BUCKET } from "@/lib/profile";
import { siteOrigin } from "@/lib/site-url";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const NOT_CONFIGURED: FormState = { error: "Sign-in isn't set up yet." };

async function signedInUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login?next=/account");
  return { supabase, user: data.user };
}

export async function changeEmail(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;
  const email = readString(formData, "email").trim();
  const invalid = checkEmail(email);
  if (invalid) return { error: invalid, email };
  const { supabase, user } = await signedInUser();
  if (email.toLowerCase() === user.email?.toLowerCase()) return { error: "That's already your email.", email };

  const { error } = await supabase.auth.updateUser(
    { email },
    // The confirmation emails link here (see the "Change Email Address" template).
    { emailRedirectTo: `${await siteOrigin()}/auth/confirm` },
  );
  if (error) {
    const taken = error.code === "email_exists" || error.code === "user_already_exists";
    return { error: taken ? "That email is already used by another account." : authErrorMessage(error), email };
  }
  revalidatePath("/account");
  return {
    message: `We've sent a confirmation link to ${email}. Your current address gets one too: open both to finish the change.`,
  };
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;
  const current = readString(formData, "current");
  const password = readString(formData, "password");
  if (!current) return { error: "Enter your current password." };
  const invalid = checkPassword(password);
  if (invalid) return { error: invalid };
  if (password !== readString(formData, "confirm")) return { error: "The new passwords don't match." };
  if (password === current) return { error: "Choose a password different from your current one." };

  const { supabase, user } = await signedInUser();
  if (!user.email) return { error: "This account has no email address to check the password against." };

  // Check the current password with a throwaway client, so an unlocked
  // session alone isn't enough to change it, then end that extra session.
  const checker = createPlainClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: wrong } = await checker.auth.signInWithPassword({ email: user.email, password: current });
  if (wrong) return { error: wrong.code === "invalid_credentials" ? "Your current password is wrong." : authErrorMessage(wrong) };
  await checker.auth.signOut({ scope: "local" });

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: authErrorMessage(error) };
  redirect("/account?notice=password");
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    // "local" signs out this browser only, not the account's other devices.
    await supabase.auth.signOut({ scope: "local" });
  }
  redirect("/");
}

// Ends every session of the account, on every device, this one included.
export async function signOutEverywhere(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "global" });
  }
  redirect("/");
}

export async function deleteAccount(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;
  if (readString(formData, "confirm").trim() !== DELETE_PHRASE) return { error: `Type ${DELETE_PHRASE} to confirm.` };
  const { supabase, user } = await signedInUser();

  // Photos first: Supabase only lets files be removed through the Storage
  // API, and the user's own folder is theirs to empty.
  const storage = supabase.storage.from(AVATAR_BUCKET);
  const { data: files } = await storage.list(user.id);
  if (files?.length) await storage.remove(files.map((f) => `${user.id}/${f.name}`));

  // Removes the auth user; their profile and completions go by cascade.
  const { error } = await supabase.rpc("delete_own_account");
  if (error) return { error: "Couldn't delete your account. Please try again." };

  // The session no longer exists; this just clears its cookies.
  await supabase.auth.signOut({ scope: "local" }).catch(() => {});
  redirect("/account-deleted");
}
