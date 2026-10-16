"use client";

import { Camera, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { setAvatar } from "@/app/(auth)/profile/actions";
import { AVATAR_INPUT_MAX_BYTES, AVATAR_SIZE_PX, AVATAR_TYPES } from "@/lib/auth-form";
import { AVATAR_BUCKET, avatarUrl } from "@/lib/profile";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "./Avatar";

// Crops the picture to its centre square and shrinks it to 256 px, as WebP
// where the browser can encode it and JPEG otherwise.
async function resize(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = AVATAR_SIZE_PX;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    AVATAR_SIZE_PX,
    AVATAR_SIZE_PX,
  );
  bitmap.close();
  const encode = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  const webp = await encode("image/webp");
  if (webp?.type === "image/webp") return webp;
  const jpeg = await encode("image/jpeg");
  if (!jpeg) throw new Error("encode failed");
  return jpeg;
}

// Tells the header's avatar to reload.
const announce = () => window.dispatchEvent(new Event("profile-updated"));

export function AvatarEditor({
  userId,
  initialUrl,
  initial,
}: {
  userId: string;
  initialUrl: string | null;
  initial: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [busy, setBusy] = useState<"upload" | "remove" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();

  async function upload(file: File) {
    setError(null);
    if (!AVATAR_TYPES.includes(file.type)) return setError("Choose a JPEG, PNG or WebP image.");
    if (file.size > AVATAR_INPUT_MAX_BYTES) return setError("Choose an image under 10 MB.");
    setBusy("upload");
    try {
      const blob = await resize(file).catch(() => {
        throw new Error("That image couldn't be read. Try another one.");
      });
      const path = `${userId}/${Date.now()}.${blob.type === "image/webp" ? "webp" : "jpg"}`;
      const storage = createClient().storage.from(AVATAR_BUCKET);
      const { error: uploadError } = await storage.upload(path, blob, {
        contentType: blob.type,
        cacheControl: "31536000",
        upsert: false,
      });
      if (uploadError) throw new Error("The upload failed. Please try again.");
      const result = await setAvatar(path);
      if (result.error) {
        await storage.remove([path]);
        throw new Error(result.error);
      }
      setUrl(avatarUrl(path));
      announce();
    } catch (e) {
      setError(e instanceof Error ? e.message : "The upload failed. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    setError(null);
    setBusy("remove");
    const result = await setAvatar(null);
    setBusy(null);
    if (result.error) return setError(result.error);
    setUrl(null);
    announce();
  }

  const button =
    "inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2 text-sm font-semibold transition hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60";

  return (
    <div>
      <p className="text-sm font-medium">Photo</p>
      <div className="mt-2 flex items-center gap-4">
        <Avatar url={url} initial={initial} size={72} />
        <div className="flex flex-wrap gap-2">
          {/* The label opens the file picker; the input itself is hidden but
              still focusable through the label's keyboard handling. */}
          <label
            htmlFor={inputId}
            className={`${button} cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${busy ? "pointer-events-none opacity-60" : ""}`}
          >
            <Camera className="size-4" aria-hidden="true" />
            {busy === "upload" ? "Uploading…" : url ? "Change photo" : "Upload photo"}
            <input
              id={inputId}
              type="file"
              accept={AVATAR_TYPES.join(",")}
              className="sr-only"
              disabled={busy !== null}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) void upload(file);
              }}
            />
          </label>
          {url && (
            <button type="button" onClick={remove} disabled={busy !== null} className={button}>
              <Trash2 className="size-4" aria-hidden="true" />
              {busy === "remove" ? "Removing…" : "Remove photo"}
            </button>
          )}
        </div>
      </div>
      <div aria-live="polite" role="status">
        {error && <p className="mt-3 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-800">{error}</p>}
      </div>
    </div>
  );
}
