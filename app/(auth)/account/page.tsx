import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { NotConfigured } from "@/components/auth/NotConfigured";
import { TextLink } from "@/components/auth/TextLink";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export const metadata: Metadata = { title: "Account settings · Landmark Tracker" };

const NOTICES: Record<string, string> = { password: "Your new password is saved." };

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  if (!isSupabaseConfigured) return <NotConfigured />;
  const supabase = await createClient();
  // The proxy already sends signed-out visitors to log in; this check is the
  // second line of defence.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/login?next=/account");

  const provider = claims.app_metadata?.provider === "google" ? "Google" : "email and password";
  const noticeKey = (await searchParams).notice;
  const notice = typeof noticeKey === "string" ? NOTICES[noticeKey] : undefined;

  return (
    <AuthCard title="Account settings">
      {notice && (
        <p role="status" className="mb-5 rounded-xl bg-primary-soft px-3.5 py-2.5 text-sm text-primary-hover">
          {notice}
        </p>
      )}
      <dl className="space-y-1 text-sm">
        <dt className="text-muted">Signed in as</dt>
        <dd className="font-medium break-all">{claims.email}</dd>
        <dd className="text-muted">with {provider}</dd>
      </dl>


      <p className="mt-6 border-t border-border pt-6 text-sm">
        <TextLink href="/profile">Your profile</TextLink>
        <span className="text-muted"> · name, username, bio and photo</span>
      </p>

      <p className="mt-6 border-t border-border pt-6 text-sm leading-relaxed text-muted">
        Landmarks you mark while signed in are saved to your account, on every device.
        Anything you mark in a browser while signed out is added the next time you log in there.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-sm">
        {provider !== "Google" && <TextLink href="/reset-password">Change password</TextLink>}
        <form action={signOut} className="ml-auto">
          <button
            type="submit"
            className="rounded-xl border border-border px-4 py-2.5 font-semibold transition hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Sign out
          </button>
        </form>
      </div>
    </AuthCard>
  );
}
