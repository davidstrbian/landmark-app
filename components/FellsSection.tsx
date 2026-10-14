"use client";

import { useState } from "react";
import type { Landmark } from "@/data/landmarks";
import { FellCard } from "./FellCard";
import { FellDialog } from "./FellDialog";

type Props = {
  fells: Landmark[];
  visited: Set<string>;
  ready: boolean;
  onToggleVisited: (id: string) => void;
};

export function FellsSection({
  fells,
  visited,
  ready,
  onToggleVisited,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = fells.find((f) => f.id === selectedId) ?? null;
  // Lowest to tallest.
  const sorted = [...fells].sort(
    (a, b) => (a.elevationM ?? 0) - (b.elevationM ?? 0),
  );

  return (
    <section
      id="fells"
      aria-labelledby="fells-heading"
      className="bg-mist py-16 text-mist-ink sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* About half the size of the hero heading. */}
        <h2
          id="fells-heading"
          className="font-heading text-[clamp(1.5rem,2.35vw,2.75rem)] font-medium leading-tight tracking-tight"
        >
          Finnish Fells
        </h2>
        <p className="mt-3 font-heading text-lg font-medium sm:text-xl">
          Ten fells, from the lakeside hills of Koli to Finland&apos;s highest
          point.
        </p>
        <p className="mt-3 max-w-3xl font-body leading-relaxed text-mist-ink/75">
          A fell, or tunturi, is a rounded hill or mountain whose bare summit
          rises above the forest. Finland&apos;s fells are the worn-down remains
          of ancient mountain ranges, so even the highest top, Halti, reaches
          only 1,324 metres. Most lie in Lapland, where open summits look out
          over endless forests, mires and lakes. Pick a fell, plan your hike and
          mark it conquered.
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sorted.map((fell) => (
            <li key={fell.id} className="min-w-0">
              <FellCard
                fell={fell}
                visited={visited.has(fell.id)}
                ready={ready}
                onOpen={(f) => setSelectedId(f.id)}
              />
            </li>
          ))}
        </ul>
      </div>

      <FellDialog
        fell={selected}
        visited={selected ? visited.has(selected.id) : false}
        onToggleVisited={onToggleVisited}
        onClose={() => setSelectedId(null)}
      />
    </section>
  );
}
