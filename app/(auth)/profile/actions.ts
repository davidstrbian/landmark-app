"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BIO_MAX, DISPLAY_NAME_MAX, USERNAME_MAX, USERNAME_MIN, USERNAME_PATTERN } from "@/lib/auth-form";
import { AVATAR_BUCKET } from "@/lib/profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type ProfileField = "displayName" | "username" | "bio" | "avatar";
export type SaveResult = { error?: string; field?: ProfileField };

export type ProfileChanges = {
  displayName: string;
  username: string;
  bio: string;
  // undefined: keep the current picture; null: remove it; a path: the picture
  // the browser has just uploaded into the user's own folder.
  avatarPath?: string | null;
};

// Saves everything the profile page's edit mode changed, in one update. When
// the picture changed, the previous file is deleted afterwards so old
// pictures don't pile up in Storage.
export async function saveProfile(changes: ProfileChanges): Promise<SaveResult> {
  if (!isSupabaseConfigured) return { error: "Sign-in isn't set up yet." };
  const displayName = changes.displayName.trim();
  const username = changes.username.trim().toLowerCase();
  const bio = changes.bio.trim();

  if (displayName.length > DISPLAY_NAME_MAX)
    return { error: `Use at most ${DISPLAY_NAME_MAX} characters for your name.`, field: "displayName" };
  if (username && !USERNAME_PATTERN.test(username))
    return {
      error: `Usernames are ${USERNAME_MIN}–${USERNAME_MAX} characters: lowercase letters, numbers and _.`,
      field: "username",
    };
  if (bio.length > BIO_MAX) return { error: `Keep your bio to ${BIO_MAX} characters.`, field: "bio" };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims.sub;
  if (!userId) redirect("/login?next=/profile");

  const { avatarPath } = changes;
  if (typeof avatarPath === "string" && (!avatarPath.startsWith(`${userId}/`) || avatarPath.includes(".."))) {
    return { error: "That picture can't be used.", field: "avatar" };
  }

  const { data: before } = await supabase.from("profiles").select("avatar_path").eq("id", userId).maybeSingle();
  const update: Record<string, string | null> = {
    display_name: displayName || null,
    username: username || null,
    bio: bio || null,
  };
  if (avatarPath !== undefined) update.avatar_path = avatarPath;

  const { data, error } = await supabase.from("profiles").update(update).eq("id", userId).select("id");
  if (error?.code === "23505") return { error: "That username is taken. Try another.", field: "username" };
  if (error || !data?.length) return { error: "Couldn't save your profile. Please try again." };

  const old = before?.avatar_path;
  if (avatarPath !== undefined && old && old !== avatarPath) {
    await supabase.storage.from(AVATAR_BUCKET).remove([old]);
  }
  revalidatePath("/profile");
  return {};
}
