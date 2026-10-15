"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Landmark } from "@/data/landmarks";
import { useVisited } from "@/hooks/use-visited";
import { FellPreview } from "./FellPreview";
import { FellDialog } from "./FellDialog";
import { LandmarkMap, type MarkerHover } from "./LandmarkMap";

const GAP = 10; // between the marker and its preview card (the arrow spans it)
const ARROW = 8; // arrow height; its half-width is the same
const ARROW_INSET = 20; // keeps the arrow off the card's rounded corners
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
// keeps it inside the map. A small triangle on its edge points at the marker. It ignores the pointer so it never steals the
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
  const [pos, setPos] = useState<{
    left: number;
    top: number;
    arrowX: number; // arrow centre, relative to the card's left edge
    below: boolean; // card under the marker, arrow on its top edge
  } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const { width, height } = el.getBoundingClientRect();
    const above = hover.top - GAP - height;
    const below = above < EDGE;
    const top = below ? hover.bottom + GAP : above;
    const left = Math.min(
      Math.max(hover.x - width / 2, EDGE),
      parent.clientWidth - width - EDGE,
    );
    // The card may be pushed sideways near the edges; the arrow still points
    // at the marker.
    const arrowX = Math.min(
      Math.max(hover.x - left, ARROW_INSET),
      width - ARROW_INSET,
    );
    setPos({ left, top, arrowX, below });
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
      {pos && (
        <svg
          viewBox={`0 0 ${ARROW * 2} ${ARROW}`}
          width={ARROW * 2}
          height={ARROW}
          className={`absolute fill-night ${pos.below ? "rotate-180" : ""}`}
          style={{
            left: pos.arrowX - ARROW,
            ...(pos.below ? { top: 1 - ARROW } : { bottom: 1 - ARROW }),
          }}
        >
          <path d={`M0 0H${ARROW * 2}L${ARROW} ${ARROW}Z`} />
        </svg>
      )}
    </div>
  );
}
