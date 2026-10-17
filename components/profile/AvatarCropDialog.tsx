"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { cropToBlob } from "@/lib/avatar-image";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

// Lets the visitor move and zoom their picture inside a circle, with a live
// preview of the finished avatar, before anything is saved. Drag (or use the
// arrow keys) to move; the slider, the mouse wheel or a pinch to zoom.
// A plain native <dialog>: the shared Modal scales its content with CSS zoom,
// which would throw off the cropper's pointer maths.
export function AvatarCropDialog({
  src,
  onCancel,
  onConfirm,
}: {
  src: string;
  onCancel: () => void;
  onConfirm: (blob: Blob, previewUrl: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<{ percent: Area; pixels: Area } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  async function confirm() {
    if (!area) return;
    setBusy(true);
    try {
      const blob = await cropToBlob(src, area.pixels);
      onConfirm(blob, URL.createObjectURL(blob));
    } catch {
      setError("That picture couldn't be cropped. Try another one.");
      setBusy(false);
    }
  }

  // The preview circle shows the same square as the cropper, scaled down.
  const preview = area?.percent;
  const button =
    "rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <dialog
      ref={ref}
      aria-labelledby="crop-title"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      className="m-auto w-[min(32rem,calc(100%-2rem))] overflow-hidden rounded-3xl bg-night-raised p-0 font-body text-white shadow-lift backdrop:bg-black/60"
    >
      <div className="p-5 sm:p-6">
        <h2 id="crop-title" className="font-heading text-xl font-semibold">
          Crop your photo
        </h2>
        <p className="mt-1 text-sm text-night-muted">Drag to move it, and zoom to fit the circle.</p>
      </div>

      <div className="relative h-72 bg-night sm:h-80">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(percent, pixels) => setArea({ percent, pixels })}
          keyboardStep={10}
        />
      </div>

      <div className="flex items-center gap-4 p-5 sm:gap-5 sm:p-6">
        {/* Live preview: how the avatar will look in its circle. */}
        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <div className="relative size-16 overflow-hidden rounded-full bg-night ring-2 ring-white/70" aria-hidden="true">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element -- a local object URL, positioned by hand
              <img
                src={src}
                alt=""
                className="absolute max-w-none"
                style={{
                  width: `${(100 / preview.width) * 100}%`,
                  height: `${(100 / preview.height) * 100}%`,
                  left: `${(-preview.x / preview.width) * 100}%`,
                  top: `${(-preview.y / preview.height) * 100}%`,
                }}
              />
            )}
          </div>
          <span className="text-xs text-night-muted">Preview</span>
        </div>

        <label className="flex min-w-0 flex-1 items-center gap-2">
          <span className="sr-only">Zoom</span>
          <Minus className="size-4 shrink-0 text-night-muted" aria-hidden="true" />
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-[var(--dusk)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dusk"
          />
          <Plus className="size-4 shrink-0 text-night-muted" aria-hidden="true" />
        </label>
      </div>

      {error && <p role="alert" className="mx-5 mb-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-800 sm:mx-6">{error}</p>}

      <div className="flex justify-end gap-3 border-t border-white/10 px-5 py-4 sm:px-6">
        <button type="button" onClick={onCancel} className={`${button} border border-white/20 hover:bg-white/10 focus-visible:outline-dusk`}>
          Cancel
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={!area || busy}
          className={`${button} bg-dusk text-night hover:bg-dusk/90 focus-visible:outline-dusk disabled:cursor-wait disabled:opacity-70`}
        >
          {busy ? "Cropping…" : "Use photo"}
        </button>
      </div>
    </dialog>
  );
}
