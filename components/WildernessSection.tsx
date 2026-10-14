"use client";

import { useState } from "react";
import type { Landmark } from "@/data/landmarks";
import { WildernessCard } from "./WildernessCard";
import { WildernessDialog } from "./WildernessDialog";

type Props = {
  areas: Landmark[];
  visited: Set<string>;
  ready: boolean;
  onToggleVisited: (id: string) => void;
};

// Sits between Finnish Fells and National Parks. Its background fades from the
// fells' grey into the page's off-white (see .bg-haze-fade in globals.css).
export function WildernessSection({
  areas,
  visited,
  ready,
  onToggleVisited,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = areas.find((a) => a.id === selectedId) ?? null;
  // Wildest first.
  const sorted = [...areas].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));

  return (
    <section
      id="wilderness"
      aria-labelledby="wilderness-heading"
      className="bg-haze-fade py-24 text-mist-ink sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* Same size as the Finnish Fells heading. */}
        <h2
          id="wilderness-heading"
          className="font-heading text-[clamp(1.5rem,2.35vw,2.75rem)] font-medium leading-tight tracking-tight"
        >
          Wilderness Areas
        </h2>
        <p className="mt-3 font-heading text-lg font-medium sm:text-xl">
          Finland has 12 wilderness areas, all in the heart of Lapland.
        </p>
        <p className="mt-3 max-w-3xl font-body leading-relaxed text-mist-ink/75">
          Set aside by the Wilderness Act of 1991, together they cover almost
          15,000 km² of fells, forests and mires. They exist to keep these lands
          wild while safeguarding Sámi culture and traditional livelihoods such
          as reindeer herding, fishing and hunting. Marked trails are few, so a
          visit here means finding your own way.
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sorted.map((area) => (
            <li key={area.id} className="min-w-0">
              <WildernessCard
                area={area}
                visited={visited.has(area.id)}
                ready={ready}
                onOpen={(a) => setSelectedId(a.id)}
              />
            </li>
          ))}
        </ul>
      </div>

      <WildernessDialog
        area={selected}
        total={areas.length}
        visited={selected ? visited.has(selected.id) : false}
        onToggleVisited={onToggleVisited}
        onClose={() => setSelectedId(null)}
      />
    </section>
  );
}
