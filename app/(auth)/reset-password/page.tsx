import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { NotConfigured } from "@/components/auth/NotConfigured";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Choose a new password · Landmark Tracker" };

// Reached from the reset email (which signs the visitor in) or from the
// account page. The proxy already sends signed-out visitors to log in; this
// check is the second line of defence.
export default async function ResetPasswordPage() {
  if (!isSupabaseConfigured) return <NotConfigured />;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login?next=/reset-password");

  return (
    <AuthCard title="Choose a new password">
      <ResetPasswordForm />
    </AuthCard>
  );
}
