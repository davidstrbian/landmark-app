"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Landmark } from "@/data/landmarks";
import { useVisited } from "@/hooks/use-visited";
import { FellPreview } from "./FellPreview";
import { FellDialog } from "./FellDialog";
import { LandmarkMap, type MarkerHover } from "./LandmarkMap";

const GAP = 10; // between the marker and its preview card
const EDGE = 12; // keeps the preview off the map's edges

// The map page's client side: shares the visited store with the home page,
// so marking a fell conquered here (or there) recolours its marker.
// Hovering a marker previews the fell's name, height and region (the bottom
// of its home-page card); clicking it opens the full dialog.
export function FellMap({ fells }: { fells: Landmark[] }) {
  const { visited, ready, toggle } = useVisited();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hover, setHover] = useState<MarkerHover | null>(null);
  const selected = fells.find((f) => f.id === selectedId) ?? null;
  const hovered = hover ? fells.find((f) => f.id === hover.id) : undefined;

  return (
    <div className="relative size-full">
      <LandmarkMap
        fells={fells}
        visited={visited}
        onSelect={setSelectedId}
        onHover={setHover}
      />
      {hover && hovered && (
        <Preview hover={hover}>
          <FellPreview
            fell={hovered}
            visited={ready && visited.has(hovered.id)}
          />
        </Preview>
      )}
      <FellDialog
        fell={selected}
        visited={selected ? visited.has(selected.id) : false}
        onToggleVisited={toggle}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}

// Places the card above the marker, or below it when there is no room, and
// keeps it inside the map. It ignores the pointer so it never steals the
// hover from the marker, and is inert (out of the tab order and hidden from
// assistive tech, which gets the marker's own label).
function Preview({
  hover,
  children,
}: {
  hover: MarkerHover;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const { width, height } = el.getBoundingClientRect();
    const above = hover.top - GAP - height;
    const top = above >= EDGE ? above : hover.bottom + GAP;
    const left = Math.min(
      Math.max(hover.x - width / 2, EDGE),
      parent.clientWidth - width - EDGE,
    );
    setPos({ left, top });
  }, [hover]);

  return (
    <div
      ref={ref}
      inert
      className="pointer-events-none absolute z-10 w-64"
      style={
        pos ? { left: pos.left, top: pos.top } : { left: 0, top: 0, opacity: 0 }
      }
    >
      {children}
    </div>
  );
}
