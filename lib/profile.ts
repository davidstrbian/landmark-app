import { supabaseUrl } from "./supabase/config";

export type Profile = {
  display_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_path: string | null;
  created_at?: string;
};

export const PROFILE_COLUMNS = "display_name, username, bio, avatar_path, created_at";
export const AVATAR_BUCKET = "avatars";

// The public address of an uploaded avatar.
export function avatarUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${supabaseUrl}/storage/v1/object/public/${AVATAR_BUCKET}/${encoded}`;
}

// What to call someone: their display name, then their username, then the
// part of their email before the @.
export function nameOf(profile: Pick<Profile, "display_name" | "username"> | null, email?: string) {
  return profile?.display_name?.trim() || profile?.username || email?.split("@")[0] || "You";
}

// The letter on the default avatar: the first letter of their first name
// (the display name's first word), falling back to the username or email.
export function initialOf(profile: Pick<Profile, "display_name" | "username"> | null, email?: string) {
  const source = profile?.display_name?.trim().split(/\s+/)[0] || profile?.username || email || "?";
  return Array.from(source)[0].toLocaleUpperCase("fi-FI");
}

const monthYear = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
export function memberSince(createdAt: string | undefined) {
  return createdAt ? monthYear.format(new Date(createdAt)) : null;
}
