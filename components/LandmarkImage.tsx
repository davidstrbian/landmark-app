"use client";

import { useState } from "react";
import Image from "next/image";
import { Mountain, Tent, Trees } from "lucide-react";
import type { Landmark, LandmarkCategory } from "@/data/landmarks";
import { BIRD_LARGE, BIRD_SMALL, spruce } from "@/lib/shapes";

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

// One layer of the wilderness placeholder, drawn in a 400×300 space. Ground
// layers stretch to the full width; the birds keep their shape and stay
// whole and centred however wide the picture is (4:3 cards, 2:1 and 4:1
// dialog pictures).
function Layer({
  stretch = false,
  children,
}: {
  stretch?: boolean;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio={stretch ? "none" : "xMidYMax meet"}
      aria-hidden="true"
      // Ground layers run 1px past the bottom so no seam shows against the
      // card or dialog below.
      className={`absolute inset-x-0 top-0 w-full ${stretch ? "h-[calc(100%+1px)]" : "h-full"}`}
    >
      {children}
    </svg>
  );
}

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
          className="absolute inset-x-0 -bottom-px h-3/5 w-full"
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
        {/* Large bird, then a smaller one further away. */}
        <Layer>
          <path d={BIRD_LARGE} className="fill-tundra" />
          <path d={BIRD_SMALL} className="fill-tundra/70" />
        </Layer>
        <Layer stretch>
          <path
            d="M0 300V214c40-10 80-14 130-8s90 4 140-6 90-10 130 0v100z"
            className="fill-[#6f8289]"
          />
          <path
            d="M0 300v-52c50-8 110-10 170-4s120 4 230-8v64z"
            className="fill-tundra"
          />
        </Layer>
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
