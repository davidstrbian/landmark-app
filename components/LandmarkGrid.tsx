"use client";

import { useMemo, useState } from "react";
import type { Landmark } from "@/data/landmarks";
import { FilterBar, type CategoryFilter } from "./FilterBar";
import { LandmarkCard } from "./LandmarkCard";
import { LandmarkDialog } from "./LandmarkDialog";

type Props = {
  landmarks: Landmark[];
  visited: Set<string>;
  ready: boolean;
  onToggleVisited: (id: string) => void;
};

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

  const filtered = useMemo(() => {
    const q = normalize(query);
    return landmarks.filter(
      (l) =>
        (category === "all" || l.category === category) &&
        (q === "" || normalize(l.name).includes(q)),
    );
  }, [landmarks, query, category]);

  const selected = landmarks.find((l) => l.id === selectedId) ?? null;

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
      />

      <p className="sr-only" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "landmark" : "landmarks"}{" "}
        shown
      </p>

      {filtered.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((landmark, index) => (
            <li key={landmark.id} className="min-w-0">
              <LandmarkCard
                landmark={landmark}
                visited={visited.has(landmark.id)}
                ready={ready}
                preload={index < 3}
                onOpen={(l) => setSelectedId(l.id)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-medium">No landmarks match your search.</p>
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

      <LandmarkDialog
        landmark={selected}
        visited={selected ? visited.has(selected.id) : false}
        onToggleVisited={onToggleVisited}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}
