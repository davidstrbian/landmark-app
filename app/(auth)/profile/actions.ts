"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  BIO_MAX,
  DISPLAY_NAME_MAX,
  USERNAME_MAX,
  USERNAME_MIN,
  USERNAME_PATTERN,
  readString,
  type FormState,
} from "@/lib/auth-form";
import { AVATAR_BUCKET } from "@/lib/profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState =
  | (FormState & { field?: "displayName" | "username" | "bio" })
  | undefined;

async function currentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (!userId) redirect("/login?next=/profile/edit");
  return { supabase, userId };
}

export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  if (!isSupabaseConfigured) return { error: "Sign-in isn't set up yet." };
  const displayName = readString(formData, "displayName").trim();
  const username = readString(formData, "username").trim().toLowerCase();
  const bio = readString(formData, "bio").trim();

  if (displayName.length > DISPLAY_NAME_MAX)
    return { error: `Use at most ${DISPLAY_NAME_MAX} characters for your name.`, field: "displayName" };
  if (username && !USERNAME_PATTERN.test(username))
    return {
      error: `Usernames are ${USERNAME_MIN}–${USERNAME_MAX} characters: lowercase letters, numbers and _.`,
      field: "username",
    };
  if (bio.length > BIO_MAX) return { error: `Keep your bio to ${BIO_MAX} characters.`, field: "bio" };

  const { supabase, userId } = await currentUser();
  const { data, error } = await supabase
    .from("profiles")
    .update({ display_name: displayName || null, username: username || null, bio: bio || null })
    .eq("id", userId)
    .select("id");
  if (error?.code === "23505") return { error: "That username is taken. Try another.", field: "username" };
  if (error || !data?.length) return { error: "Couldn't save your profile. Please try again." };

  revalidatePath("/profile");
  redirect("/profile?notice=saved");
}

// Called by the avatar editor after it has uploaded a new picture (or with
// null to remove it). Points the profile at the new file, then deletes the
// previous one so old pictures don't pile up in Storage.
export async function setAvatar(path: string | null): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: "Sign-in isn't set up yet." };
  const { supabase, userId } = await currentUser();
  if (path !== null && (!path.startsWith(`${userId}/`) || path.includes(".."))) {
    return { error: "That picture can't be used." };
  }

  const { data: before } = await supabase
    .from("profiles")
    .select("avatar_path")
    .eq("id", userId)
    .maybeSingle();
  const { data, error } = await supabase
    .from("profiles")
    .update({ avatar_path: path })
    .eq("id", userId)
    .select("id");
  if (error || !data?.length) return { error: "Couldn't save your picture. Please try again." };

  const old = before?.avatar_path;
  if (old && old !== path) await supabase.storage.from(AVATAR_BUCKET).remove([old]);
  revalidatePath("/profile");
  return {};
}
