"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Landmark } from "@/data/landmarks";
import { FilterBar, type CategoryFilter } from "./FilterBar";
import { ParkCard } from "./ParkCard";
import { ParkDialog } from "./ParkDialog";

type Props = {
  landmarks: Landmark[];
  visited: Set<string>;
  ready: boolean;
  onToggleVisited: (id: string) => void;
};

// Cards shown before "Show more" is pressed. A search always shows every
// match.
const INITIAL_COUNT = 12;

// Matches regardless of case and diacritics, so "yllas" finds "Ylläs".
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function LandmarkGrid({
  landmarks,
  visited,
  ready,
  onToggleVisited,
}: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return landmarks.filter(
      (l) =>
        (category === "all" || l.category === category) &&
        (q === "" || normalize(l.name).includes(q)),
    );
  }, [landmarks, query, category]);

  const searching = query.trim() !== "" || category !== "all";
  const collapsible = !searching && filtered.length > INITIAL_COUNT;
  const shown =
    collapsible && !expanded ? filtered.slice(0, INITIAL_COUNT) : filtered;

  const selected = landmarks.find((l) => l.id === selectedId) ?? null;
  const categories = [...new Set(landmarks.map((l) => l.category))];

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
      />

      <p className="sr-only" aria-live="polite">
        {shown.length} of {filtered.length}{" "}
        {filtered.length === 1 ? "park" : "parks"} shown
      </p>

      {filtered.length > 0 ? (
        <ul
          ref={listRef}
          id="park-list"
          className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
        >
          {shown.map((landmark) => (
            <li key={landmark.id} className="min-w-0">
              <ParkCard
                park={landmark}
                visited={visited.has(landmark.id)}
                ready={ready}
                onOpen={(l) => setSelectedId(l.id)}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {collapsible && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="park-list"
            onClick={() => {
              if (expanded) {
                listRef.current?.scrollIntoView({ block: "start" });
              }
              setExpanded(!expanded);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 font-body font-medium text-white shadow-[0_10px_30px_rgb(20_32_26/0.14)] transition duration-200 hover:bg-forest-raised focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {expanded ? (
              <>
                Show fewer
                <ChevronUp className="size-5" aria-hidden="true" />
              </>
            ) : (
              <>
                Show all {filtered.length} parks
                <ChevronDown className="size-5" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-medium">No national parks match your search.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-3 rounded-full text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Clear filters
          </button>
        </div>
      )}

      <ParkDialog
        park={selected}
        visited={selected ? visited.has(selected.id) : false}
        onToggleVisited={onToggleVisited}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}
