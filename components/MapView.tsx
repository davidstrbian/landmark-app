"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Landmark, LandmarkCategory } from "@/data/landmarks";
import { useVisited } from "@/hooks/use-visited";
import { FellDialog } from "./FellDialog";
import { LandmarkPreview, PREVIEW_TONES } from "./LandmarkPreview";
import { ParkDialog } from "./ParkDialog";
import { WildernessDialog } from "./WildernessDialog";
import {
  LandmarkMap,
  type FitRequest,
  type MarkerHover,
} from "./LandmarkMap";
import { MapSearch } from "./MapSearch";
import { normalize } from "@/lib/search";

const GAP = 10; // between the marker and its preview card (the arrow spans it)
const ARROW = 8; // arrow height; its half-width is the same
const ARROW_INSET = 20; // keeps the arrow off the card's rounded corners
const EDGE = 12; // keeps the preview off the map's edges

// The map page's client side. It shares the visited store with the home page,
// so completing a landmark here (or there) recolours its marker. Hovering a
// marker previews the landmark's name and region (the bottom of its home-page
// card); clicking it opens the landmark's full dialog.
export function MapView({ landmarks }: { landmarks: Landmark[] }) {
  const { visited, ready, toggle } = useVisited();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hover, setHover] = useState<MarkerHover | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<LandmarkCategory | null>(null);
  const [fitRequest, setFitRequest] = useState<FitRequest | null>(null);
  const inCategory = useMemo(
    () => landmarks.filter((l) => category === null || l.category === category),
    [landmarks, category],
  );
  // Ids in the active category whose name contains the search text.
  const matching = (text: string) => {
    const q = normalize(text);
    return inCategory
      .filter((l) => q === "" || normalize(l.name).includes(q))
      .map((l) => l.id);
  };
  const visible = useMemo(() => {
    const q = normalize(query);
    return new Set(
      inCategory
        .filter((l) => q === "" || normalize(l.name).includes(q))
        .map((l) => l.id),
    );
  }, [inCategory, query]);
  const selected = landmarks.find((l) => l.id === selectedId) ?? null;
  const hovered = hover ? landmarks.find((l) => l.id === hover.id) : undefined;
  // Each category has its own dialog; only the selected one is open.
  const pick = (category: Landmark["category"]) =>
    selected?.category === category ? selected : null;
  const dialog = {
    visited: selected ? visited.has(selected.id) : false,
    onToggleVisited: toggle,
    onClose: () => setSelectedId(null),
  };

  return (
    <div className="relative size-full">
      <LandmarkMap
        landmarks={landmarks}
        visible={visible}
        visited={visited}
        fitRequest={fitRequest}
        onSelect={setSelectedId}
        onHover={setHover}
      />
      <MapSearch
        landmarks={inCategory}
        query={query}
        onQueryChange={setQuery}
        onSubmit={(text) => {
          const ids = matching(text);
          setFitRequest({ ids });
          return ids.length;
        }}
        onPick={(landmark) => setFitRequest({ ids: [landmark.id] })}
        category={category}
        onCategoryChange={setCategory}
        matches={visible.size}
        visited={visited}
        ready={ready}
      />
      {hover && hovered && visible.has(hovered.id) && (
        <Preview hover={hover} arrowFill={PREVIEW_TONES[hovered.category].fill}>
          <LandmarkPreview
            landmark={hovered}
            visited={ready && visited.has(hovered.id)}
          />
        </Preview>
      )}
      <FellDialog {...dialog} fell={pick("peak")} />
      <WildernessDialog {...dialog} area={pick("wilderness-area")} />
      <ParkDialog {...dialog} park={pick("national-park")} />
    </div>
  );
}

// Places the card above the marker, or below it when there is no room, and
// keeps it inside the map. A small triangle on its edge points at the marker.
// It ignores the pointer so it never steals the hover from the marker, and is inert (out of the tab order and hidden from
// assistive tech, which gets the marker's own label).
function Preview({
  hover,
  arrowFill,
  children,
}: {
  hover: MarkerHover;
  arrowFill: string; // matches the card's background
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
      className="pointer-events-none absolute z-10 w-max min-w-64 max-w-[min(22rem,calc(100%-1.5rem))]"
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
          className={`absolute ${arrowFill} ${pos.below ? "rotate-180" : ""}`}
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
