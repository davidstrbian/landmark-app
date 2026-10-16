import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { NotConfigured } from "@/components/auth/NotConfigured";
import { TextLink } from "@/components/auth/TextLink";
import { AvatarEditor } from "@/components/profile/AvatarEditor";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PROFILE_COLUMNS, avatarUrl, initialOf, type Profile } from "@/lib/profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Edit profile · Landmark Tracker" };

export default async function EditProfilePage() {
  if (!isSupabaseConfigured) return <NotConfigured />;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const claims = auth?.claims;
  if (!claims) redirect("/login?next=/profile/edit");
  const { data: profile } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", claims.sub)
    .maybeSingle<Profile>();

  return (
    <AuthCard title="Edit profile">
      <AvatarEditor
        userId={claims.sub}
        initialUrl={avatarUrl(profile?.avatar_path)}
        initial={initialOf(profile, claims.email)}
      />
      <div className="mt-6 border-t border-border pt-6">
        <ProfileForm
          displayName={profile?.display_name ?? ""}
          username={profile?.username ?? ""}
          bio={profile?.bio ?? ""}
        />
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        <TextLink href="/profile">Back to your profile</TextLink>
      </p>
    </AuthCard>
  );
}
