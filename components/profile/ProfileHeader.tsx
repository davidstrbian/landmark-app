"use client";

import { CalendarDays, Camera, Pencil, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { saveProfile, type ProfileField } from "@/app/(auth)/profile/actions";
import {
  AVATAR_INPUT_MAX_BYTES,
  AVATAR_TYPES,
  BIO_MAX,
  DISPLAY_NAME_MAX,
  USERNAME_MAX,
  USERNAME_PATTERN,
} from "@/lib/auth-form";
import { AVATAR_BUCKET, initialOf, nameOf } from "@/lib/profile";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "./Avatar";
import { AvatarCropDialog } from "./AvatarCropDialog";

type Props = {
  userId: string;
  email?: string;
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string | null;
  memberSince: string | null;
};

// The picture as it stands in edit mode: unchanged, a newly cropped one
// waiting to be uploaded on save, or removed.
type AvatarDraft = { kind: "keep" } | { kind: "new"; blob: Blob; previewUrl: string } | { kind: "remove" };

const AVATAR_PX = 112;

// The top of the profile page. "Edit profile" turns the name, username, bio
// and avatar into fields right where they are; the button becomes "Save
// changes", which uploads any new picture, saves everything at once and
// switches back.
export function ProfileHeader(props: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(props.displayName);
  const [username, setUsername] = useState(props.username);
  const [bio, setBio] = useState(props.bio);
  const [avatar, setAvatar] = useState<AvatarDraft>({ kind: "keep" });
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<{ text: string; field?: ProfileField } | null>(null);
  const [saved, setSaved] = useState(false);
  const fileId = useId();
  const nameRef = useRef<HTMLInputElement>(null);

  // Free the browser's copies of pictures that are no longer shown.
  useEffect(() => () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
  }, [cropSrc]);
  useEffect(() => () => {
    if (avatar.kind === "new") URL.revokeObjectURL(avatar.previewUrl);
  }, [avatar]);
  useEffect(() => {
    if (editing) nameRef.current?.focus();
  }, [editing]);

  const draftProfile = { display_name: displayName, username };
  const shownUrl = avatar.kind === "new" ? avatar.previewUrl : avatar.kind === "remove" ? null : props.avatarUrl;
  const usernameOk = username === "" || USERNAME_PATTERN.test(username);

  function startEditing() {
    setSaved(false);
    setError(null);
    setEditing(true);
  }

  function cancel() {
    setDisplayName(props.displayName);
    setUsername(props.username);
    setBio(props.bio);
    setAvatar({ kind: "keep" });
    setError(null);
    setEditing(false);
  }

  function pick(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (!AVATAR_TYPES.includes(file.type)) return setError({ text: "Choose a JPEG, PNG or WebP image.", field: "avatar" });
    if (file.size > AVATAR_INPUT_MAX_BYTES) return setError({ text: "Choose an image under 10 MB.", field: "avatar" });
    setCropSrc(URL.createObjectURL(file));
  }

  async function save() {
    if (!usernameOk) return setError({ text: "Use 3–20 lowercase letters, numbers or _ for your username.", field: "username" });
    setSaving(true);
    setError(null);
    const storage = createClient().storage.from(AVATAR_BUCKET);
    let avatarPath: string | null | undefined;
    if (avatar.kind === "new") {
      const path = `${props.userId}/${Date.now()}.${avatar.blob.type === "image/webp" ? "webp" : "jpg"}`;
      const { error: uploadError } = await storage.upload(path, avatar.blob, {
        contentType: avatar.blob.type,
        cacheControl: "31536000",
        upsert: false,
      });
      if (uploadError) {
        setSaving(false);
        return setError({ text: "The photo didn't upload. Please try again.", field: "avatar" });
      }
      avatarPath = path;
    } else if (avatar.kind === "remove") {
      avatarPath = null;
    }

    const result = await saveProfile({ displayName, username, bio, avatarPath });
    setSaving(false);
    if (result.error) {
      // Don't leave an unused upload behind.
      if (typeof avatarPath === "string") await storage.remove([avatarPath]);
      return setError({ text: result.error, field: result.field });
    }
    setUsername(username.trim().toLowerCase());
    setAvatar({ kind: "keep" });
    setEditing(false);
    setSaved(true);
    window.dispatchEvent(new Event("profile-updated")); // the header avatar
    router.refresh();
  }

  const field =
    "w-full rounded-xl border border-white/15 bg-night/60 px-3 py-2 text-white placeholder:text-night-muted/70 focus-visible:border-dusk focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-dusk aria-[invalid=true]:border-red-300";
  const primary =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-dusk px-4 py-2.5 text-sm font-semibold text-night transition hover:bg-dusk/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk disabled:cursor-wait disabled:opacity-70";
  const secondary =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk disabled:opacity-60";

  return (
    <section aria-labelledby="profile-name" className="rounded-3xl bg-night-raised p-5 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (editing) void save();
        }}
        className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7"
      >
        {/* Avatar: in edit mode it becomes a button that opens the picker. */}
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-center">
          {editing ? (
            <label
              htmlFor={fileId}
              className="group relative cursor-pointer rounded-full has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-dusk"
            >
              <Avatar url={shownUrl} initial={initialOf(draftProfile, props.email)} size={AVATAR_PX} className="ring-4 ring-night" />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-night/55 text-xs font-semibold opacity-90 transition group-hover:opacity-100">
                <Camera className="size-5" aria-hidden="true" />
                {shownUrl ? "Change" : "Add photo"}
              </span>
              <input
                id={fileId}
                type="file"
                accept={AVATAR_TYPES.join(",")}
                aria-label={shownUrl ? "Change photo" : "Add photo"}
                className="sr-only"
                onChange={(e) => {
                  pick(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
          ) : (
            <Avatar url={shownUrl} initial={initialOf(draftProfile, props.email)} size={AVATAR_PX} className="ring-4 ring-night" />
          )}
          {editing && shownUrl && (
            <button
              type="button"
              onClick={() => setAvatar({ kind: "remove" })}
              className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-xs text-night-muted transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              Remove photo
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="space-y-2.5">
              <h1 id="profile-name" className="sr-only">Edit your profile</h1>
              <label className="block">
                <span className="sr-only">Name</span>
                <input
                  ref={nameRef}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={DISPLAY_NAME_MAX}
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={error?.field === "displayName"}
                  className={`${field} font-heading text-2xl font-semibold tracking-tight sm:text-3xl`}
                />
              </label>
              <label className="flex items-center gap-1 text-night-muted">
                <span aria-hidden="true">@</span>
                <span className="sr-only">Username</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, "_"))}
                  maxLength={USERNAME_MAX}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="username"
                  aria-invalid={!usernameOk || error?.field === "username"}
                  aria-describedby="username-hint"
                  className={`${field} py-1.5 text-base sm:text-sm`}
                />
              </label>
              <p id="username-hint" className={`text-xs ${usernameOk ? "text-night-muted" : "text-red-300"}`}>
                3–20 characters: lowercase letters, numbers and _.
              </p>
              <label className="block">
                <span className="sr-only">Bio</span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={BIO_MAX}
                  rows={2}
                  placeholder="A line about you: where you hike, what you're collecting."
                  aria-invalid={error?.field === "bio"}
                  aria-describedby="bio-count"
                  className={`${field} block resize-none text-base leading-relaxed sm:text-sm`}
                />
              </label>
              <p id="bio-count" className="text-right text-xs text-night-muted tabular-nums">
                {bio.length} / {BIO_MAX}
              </p>
            </div>
          ) : (
            <>
              <h1 id="profile-name" className="font-heading text-2xl font-semibold tracking-tight break-words sm:text-3xl">
                {nameOf(draftProfile, props.email)}
              </h1>
              {username && <p className="mt-0.5 text-night-muted">@{username}</p>}
              {bio && <p className="mt-3 max-w-prose leading-relaxed whitespace-pre-line text-white/90">{bio}</p>}
            </>
          )}
          {props.memberSince && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-night-muted">
              <CalendarDays className="size-4" aria-hidden="true" />
              Member since {props.memberSince}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-col sm:items-stretch">
          {editing ? (
            <>
              {/* Separate keys: if React reused the "Edit profile" button for
                  this one, the click that opened edit mode would turn it into
                  a submit button before the browser finished the click, and
                  submit the form straight away. */}
              <button key="save" type="submit" disabled={saving} className={primary}>
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button key="cancel" type="button" onClick={cancel} disabled={saving} className={secondary}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button key="edit" type="button" onClick={startEditing} className={primary}>
                <Pencil className="size-4" aria-hidden="true" />
                Edit profile
              </button>
              <Link key="settings" href="/account" className={secondary}>
                <Settings className="size-4" aria-hidden="true" />
                <span aria-hidden="true" className="sm:hidden">Settings</span>
                <span className="sr-only sm:not-sr-only">Account settings</span>
              </Link>
            </>
          )}
        </div>
      </form>

      <div aria-live="polite" role="status">
        {error && <p className="mt-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-800">{error.text}</p>}
        {saved && !editing && <p className="mt-4 rounded-xl bg-primary-soft px-3.5 py-2.5 text-sm text-primary-hover">Profile saved.</p>}
      </div>

      {cropSrc && (
        <AvatarCropDialog
          src={cropSrc}
          onCancel={() => setCropSrc(null)}
          onConfirm={(blob, previewUrl) => {
            setAvatar({ kind: "new", blob, previewUrl });
            setCropSrc(null);
          }}
        />
      )}
    </section>
  );
}
