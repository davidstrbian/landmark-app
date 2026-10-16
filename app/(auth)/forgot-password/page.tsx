import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { NotConfigured } from "@/components/auth/NotConfigured";
import { TextLink } from "@/components/auth/TextLink";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Forgot password · Landmark Tracker" };

export default function ForgotPasswordPage() {
  if (!isSupabaseConfigured) return <NotConfigured />;
  return (
    <AuthCard title="Forgot your password?" intro="Enter your email and we'll send you a link to choose a new one.">
      <ForgotPasswordForm />
      <p className="mt-6 text-center text-sm text-muted">
        Remembered it? <TextLink href="/login">Log in</TextLink>
      </p>
    </AuthCard>
  );
}
