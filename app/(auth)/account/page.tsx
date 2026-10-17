import { ArrowLeft, LogOut } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteAccount } from "@/components/account/DeleteAccount";
import { EmailSetting } from "@/components/account/EmailSetting";
import { PasswordSetting } from "@/components/account/PasswordSetting";
import { SettingsRow, SettingsSection, settingsButton } from "@/components/account/Settings";
import { NotConfigured } from "@/components/auth/NotConfigured";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { signOut, signOutEverywhere } from "./actions";

export const metadata: Metadata = { title: "Account settings · Landmark Tracker" };

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  if (!isSupabaseConfigured) return <NotConfigured />;
  const supabase = await createClient();
  // The proxy already sends signed-out visitors to log in; this is the second
  // check. getUser (not getClaims) because it also says whether an email
  // change is waiting for confirmation.
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/login?next=/account");

  const providers: string[] = user.app_metadata?.providers ?? [user.app_metadata?.provider ?? "email"];
  const hasPassword = providers.includes("email");
  const pendingEmail = user.new_email ?? null;

  const notices: Record<string, string> = {
    password: "Your password has been updated.",
    email: pendingEmail
      ? "One more step: open the confirmation link sent to your other address."
      : "Your email address has been changed.",
  };
  const noticeKey = (await searchParams).notice;
  const notice = typeof noticeKey === "string" ? notices[noticeKey] : undefined;

  return (
    <div className="font-settings w-full max-w-2xl self-start overflow-hidden rounded-3xl bg-card text-foreground shadow-lift sm:self-center">
      <header className="px-5 pt-6 pb-5 sm:px-8 sm:pt-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Account settings</h1>
        <p className="mt-1 text-sm break-all text-muted">Signed in as {user.email}</p>
        <div role="status" aria-live="polite">
          {notice && <p className="mt-4 rounded-xl bg-primary-soft px-3.5 py-2.5 text-sm text-primary-hover">{notice}</p>}
        </div>
      </header>

      <SettingsSection label="Sign-in">
        <EmailSetting email={user.email ?? ""} pendingEmail={pendingEmail} canChange={hasPassword} />
        <PasswordSetting hasPassword={hasPassword} />
      </SettingsSection>

      <SettingsSection label="Session">
        <SettingsRow
          title="Log out"
          description="Log out on this device, or on every device where you're signed in."
          action={
            <>
              <form action={signOut}>
                <button type="submit" className={settingsButton}>
                  <LogOut className="size-4" aria-hidden="true" />
                  Log out
                </button>
              </form>
              <form action={signOutEverywhere}>
                <button type="submit" className={settingsButton}>
                  Log out on all devices
                </button>
              </form>
            </>
          }
        />
      </SettingsSection>

      <SettingsSection label="Danger zone" tone="danger">
        <DeleteAccount />
      </SettingsSection>

      <footer className="border-t border-border bg-subtle/50 px-5 py-4 sm:px-8">
        <Link
          href="/profile"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-night px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-night-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to profile
        </Link>
      </footer>
    </div>
  );
}
