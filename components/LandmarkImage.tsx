"use client";

import { useState } from "react";
import Image from "next/image";
import { Mountain, Tent, Trees } from "lucide-react";
import type { Landmark, LandmarkCategory } from "@/data/landmarks";

const PLACEHOLDERS: Record<
  LandmarkCategory,
  { gradient: string; Icon: typeof Mountain }
> = {
  peak: {
    gradient: "from-[#dfe7e3] via-[#c5d6ce] to-[#9fbcae]",
    Icon: Mountain,
  },
  "national-park": {
    gradient: "from-[#e4ece2] via-[#c9dcc6] to-[#a3c39f]",
    Icon: Trees,
  },
  "wilderness-area": {
    gradient: "from-[#e1e9ec] via-[#c6d8de] to-[#a1bfc9]",
    Icon: Tent,
  },
};

// A spruce silhouette: a trunk under four tiers that widen towards the
// ground. x is the centre, y the ground line, h the height.
function spruce(x: number, y: number, h: number) {
  const w = h * 0.36; // half-width of the lowest tier
  const tiers = 4;
  let d = `M${x} ${y - h}`;
  const right: string[] = [];
  const left: string[] = [];
  for (let i = 1; i <= tiers; i++) {
    const ty = y - h + (h * 0.88 * i) / tiers;
    const tw = (w * i) / tiers;
    const inner = tw * 0.45;
    right.push(`L${x + tw} ${ty}L${x + inner} ${ty}`);
    left.unshift(`L${x - inner} ${ty}L${x - tw} ${ty}`);
  }
  // Drop the inner notch of the lowest tier so the trunk joins it.
  right[tiers - 1] = right[tiers - 1].replace(/L[^L]+$/, "");
  left[0] = left[0].replace(/^L[^L]+/, "");
  const trunk = h * 0.05;
  const base = y - h * 0.12;
  d += right.join("");
  d += `L${x + trunk} ${base}L${x + trunk} ${y}L${x - trunk} ${y}L${x - trunk} ${base}`;
  d += left.join("") + "Z";
  return d;
}

// Back row, then front row, of the national park placeholder.
const BACK_SPRUCES = [
  [52, 228, 70],
  [92, 226, 92],
  [300, 224, 84],
  [338, 226, 64],
  [372, 228, 76],
]
  .map(([x, y, h]) => spruce(x, y, h))
  .join("");
const FRONT_SPRUCES = [
  [128, 262, 150],
  [176, 262, 104],
  [252, 262, 122],
]
  .map(([x, y, h]) => spruce(x, y, h))
  .join("");

type Props = {
  landmark: Landmark;
  sizes: string;
  preload?: boolean;
  className?: string;
};

// Photo with a blur-up placeholder, or a category gradient when there is no
// photo yet or it fails to load.
export function LandmarkImage({ landmark, sizes, preload, className }: Props) {
  const [failed, setFailed] = useState(false);

  if ((!landmark.image || failed) && landmark.category === "peak") {
    // Dusk sky over layered ridges, echoing the hero photo.
    return (
      <div
        role="img"
        aria-label={`${landmark.name} (no photo yet)`}
        className={`relative overflow-hidden bg-gradient-to-b from-[#7d878e] via-[#a39a94] to-[#c9a58e] ${className ?? ""}`}
      >
        <svg
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-3/5 w-full"
        >
          <path
            d="M0 300V185l55-40 35 22 58-72 50 55 36-30 54 52 48-40 64 50v118z"
            className="fill-[#454c52]"
          />
          <path
            d="M0 300v-72l78-32 62 36 72-42 58 38 62-26 68 36v62z"
            className="fill-night"
          />
        </svg>
      </div>
    );
  }

  if ((!landmark.image || failed) && landmark.category === "wilderness-area") {
    // Pale northern sky over low tundra, with soaring birds for the freedom
    // of the wilderness. The sky starts close to the section's haze colour.
    return (
      <div
        role="img"
        aria-label={`${landmark.name} (no photo yet)`}
        className={`relative overflow-hidden bg-gradient-to-b from-[#cfd7da] via-[#b4c1c6] to-[#93a5ac] ${className ?? ""}`}
      >
        <svg
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          className="absolute inset-0 size-full"
        >
          {/* Large bird, then a smaller one further away. */}
          <path
            d="M200 109c-16-16-40-28-80-24 32 4 52 16 68 32l12 8 12-8c16-16 36-28 68-32-40-4-64 8-80 24z"
            className="fill-tundra"
          />
          <path
            d="M286 74c-6-6-15-10-30-9 12 2 19 6 25 12l5 3 4-3c6-6 13-10 25-12-15-1-24 3-29 9z"
            className="fill-tundra/70"
          />
          <path
            d="M0 300V214c40-10 80-14 130-8s90 4 140-6 90-10 130 0v100z"
            className="fill-[#6f8289]"
          />
          <path
            d="M0 300v-52c50-8 110-10 170-4s120 4 230-8v64z"
            className="fill-tundra"
          />
        </svg>
      </div>
    );
  }

  if ((!landmark.image || failed) && landmark.category === "national-park") {
    // Spruces under a pale sky that starts near the page's off-white.
    return (
      <div
        role="img"
        aria-label={`${landmark.name} (no photo yet)`}
        className={`relative overflow-hidden bg-gradient-to-b from-[#eef1ea] via-[#d5e0d2] to-[#adc3b0] ${className ?? ""}`}
      >
        <svg
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          className="absolute inset-0 size-full"
        >
          <path
            d="M0 300V232c60-12 120-14 190-8s140 4 210-8v84z"
            className="fill-[#7f9a88]"
          />
          <path d={BACK_SPRUCES} className="fill-[#5e7b68]" />
          <path
            d="M0 300v-44c60-8 130-10 200-4s140 4 200-6v54z"
            className="fill-forest"
          />
          <path d={FRONT_SPRUCES} className="fill-forest" />
        </svg>
      </div>
    );
  }

  if (!landmark.image || failed) {
    const { gradient, Icon } = PLACEHOLDERS[landmark.category];
    return (
      <div
        role="img"
        aria-label={`${landmark.name} (no photo yet)`}
        className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className ?? ""}`}
      >
        <Icon
          className="size-10 text-white/80"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <Image
        src={landmark.image}
        alt={landmark.name}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
