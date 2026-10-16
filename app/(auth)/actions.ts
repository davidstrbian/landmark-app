"use server";

import { redirect } from "next/navigation";
import { authErrorMessage } from "@/lib/auth-errors";
import { checkEmail, checkPassword, readString, type FormState } from "@/lib/auth-form";
import { safeNext } from "@/lib/safe-next";
import { siteOrigin } from "@/lib/site-url";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const NOT_CONFIGURED: FormState = { error: "Sign-in isn't set up yet." };

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;
  const email = readString(formData, "email").trim();
  const password = readString(formData, "password");
  const invalid = checkEmail(email) ?? (password ? undefined : "Enter your password.");
  if (invalid) return { error: invalid, email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: authErrorMessage(error), email };
  redirect(safeNext(readString(formData, "next")));
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;
  const email = readString(formData, "email").trim();
  const password = readString(formData, "password");
  const invalid = checkEmail(email) ?? checkPassword(password);
  if (invalid) return { error: invalid, email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    // The confirmation email links here (see the "Confirm signup" template).
    options: { emailRedirectTo: `${await siteOrigin()}/auth/confirm` },
  });
  if (error) return { error: authErrorMessage(error), email };
  // Supabase answers the same way when the email is already registered, so
  // this message doesn't reveal who has an account.
  return {
    message: `We've sent a confirmation link to ${email}. Open it to finish signing up.`,
    email,
  };
}

export async function signInWithGoogle(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured) redirect("/login");
  const next = safeNext(readString(formData, "next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${await siteOrigin()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error || !data.url) redirect("/login?error=oauth");
  redirect(data.url);
}

export async function requestPasswordReset(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;
  const email = readString(formData, "email").trim();
  const invalid = checkEmail(email);
  if (invalid) return { error: invalid, email };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // The reset email links here (see the "Reset password" template).
    redirectTo: `${await siteOrigin()}/auth/confirm`,
  });
  // Only rate limits are worth reporting; anything else would hint at
  // whether the email has an account.
  if (error?.code === "over_email_send_rate_limit") return { error: authErrorMessage(error), email };
  return {
    message: `If ${email} has an account, we've sent it a link to choose a new password.`,
    email,
  };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;
  const password = readString(formData, "password");
  const invalid = checkPassword(password);
  if (invalid) return { error: invalid };
  if (password !== readString(formData, "confirm")) return { error: "The passwords don't match." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: authErrorMessage(error) };
  redirect("/account?notice=password");
}
