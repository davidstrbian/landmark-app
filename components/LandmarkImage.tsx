"use client";

import { useState } from "react";
import Image from "next/image";
import { Mountain, Trees, Waves } from "lucide-react";
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
  other: {
    gradient: "from-[#e1e9ec] via-[#c6d8de] to-[#a1bfc9]",
    Icon: Waves,
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
