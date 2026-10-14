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
