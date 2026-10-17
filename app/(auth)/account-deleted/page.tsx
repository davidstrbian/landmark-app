import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { TextLink } from "@/components/auth/TextLink";

export const metadata: Metadata = { title: "Account deleted · Landmark Tracker" };

// Where deleting an account ends up.
export default function AccountDeletedPage() {
  return (
    <AuthCard title="Your account has been deleted">
      <p className="text-sm leading-relaxed text-muted">
        Your profile, photo and completed landmarks have been removed. Thanks for exploring Finland with us.
      </p>
      <p className="mt-5 text-sm">
        <TextLink href="/">Back to the landmarks</TextLink>
      </p>
    </AuthCard>
  );
}
