import { AuthCard } from "./AuthCard";
import { TextLink } from "./TextLink";

export function NotConfigured() {
  return (
    <AuthCard title="Sign-in isn't set up yet">
      <p className="text-sm leading-relaxed text-muted">
        Accounts need a Supabase project. Your visited landmarks are still saved in this browser.
      </p>
      <p className="mt-4 text-sm">
        <TextLink href="/">Back to the landmarks</TextLink>
      </p>
    </AuthCard>
  );
}
