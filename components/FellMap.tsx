"use client";

import { useState } from "react";
import type { Landmark } from "@/data/landmarks";
import { useVisited } from "@/hooks/use-visited";
import { FellDialog } from "./FellDialog";
import { LandmarkMap } from "./LandmarkMap";

// The map page's client side: shares the visited store with the home page,
// so marking a fell conquered here (or there) recolours its marker.
export function FellMap({ fells }: { fells: Landmark[] }) {
  const { visited, toggle } = useVisited();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = fells.find((f) => f.id === selectedId) ?? null;

  return (
    <>
      <LandmarkMap fells={fells} visited={visited} onSelect={setSelectedId} />
      <FellDialog
        fell={selected}
        visited={selected ? visited.has(selected.id) : false}
        onToggleVisited={toggle}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}
