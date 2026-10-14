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
