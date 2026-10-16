import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { Divider } from "@/components/auth/Divider";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { LoginForm } from "@/components/auth/LoginForm";
import { NotConfigured } from "@/components/auth/NotConfigured";
import { TextLink } from "@/components/auth/TextLink";
import { safeNext } from "@/lib/safe-next";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Log in · Landmark Tracker" };

// Set by the email-link and Google return routes when something goes wrong.
const ERRORS: Record<string, string> = {
  link: "That link has expired or was already used. Request a new one.",
  oauth: "Google sign-in didn't finish. Please try again.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (!isSupabaseConfigured) return <NotConfigured />;
  const params = await searchParams;
  const next = safeNext(params.next);
  const error = typeof params.error === "string" ? ERRORS[params.error] : undefined;
  const signupHref = next === "/profile" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`;

  return (
    <AuthCard title="Log in" intro="Welcome back to your landmarks.">
      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
          {error}
        </p>
      )}
      <GoogleButton next={next} />
      <Divider />
      <LoginForm next={next} />
      <p className="mt-6 text-center text-sm text-muted">
        New here? <TextLink href={signupHref}>Create an account</TextLink>
      </p>
    </AuthCard>
  );
}
