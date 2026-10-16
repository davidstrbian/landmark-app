import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { Divider } from "@/components/auth/Divider";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { NotConfigured } from "@/components/auth/NotConfigured";
import { SignupForm } from "@/components/auth/SignupForm";
import { TextLink } from "@/components/auth/TextLink";
import { safeNext } from "@/lib/safe-next";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Create an account · Landmark Tracker" };

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  if (!isSupabaseConfigured) return <NotConfigured />;
  const next = safeNext((await searchParams).next);

  return (
    <AuthCard title="Create an account" intro="Keep track of the fells, wilderness areas and parks you've been to.">
      <GoogleButton next={next} />
      <Divider />
      <SignupForm />
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account? <TextLink href="/login">Log in</TextLink>
      </p>
    </AuthCard>
  );
}
