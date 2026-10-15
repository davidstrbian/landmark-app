"use client";

import { Search } from "lucide-react";
import type { LandmarkCategory } from "@/data/landmarks";
import { CATEGORY_ICONS } from "@/lib/marker-icons";

const CATEGORIES: { category: LandmarkCategory; label: string }[] = [
  { category: "peak", label: "Fells" },
  { category: "wilderness-area", label: "Wilderness areas" },
  { category: "national-park", label: "National parks" },
];

type Props = {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: () => void; // Enter: zoom to the matches
  category: LandmarkCategory | null;
  onCategoryChange: (category: LandmarkCategory | null) => void;
  matches: number;
};

// The map's top-left controls: a search box and one round button per
// category, using the markers' symbols. A pressed button shows only its
// category and swaps to inverted colours; pressing it again shows everything.
export function MapSearch({
  query,
  onQueryChange,
  onSubmit,
  category,
  onCategoryChange,
  matches,
}: Props) {
  return (
    <div className="absolute left-3 right-14 top-3 z-10 font-body sm:right-auto">
      <div className="flex items-center gap-2">
        <form
          role="search"
          className="relative min-w-0 flex-1 sm:w-72 sm:flex-none"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label htmlFor="map-search" className="sr-only">
            Search the map by name
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5b646b]"
            aria-hidden="true"
          />
          <input
            id="map-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by name"
            autoComplete="off"
            className="h-9 w-full rounded-full bg-white pl-10 pr-4 text-sm text-mist-ink shadow-[0_4px_12px_rgb(20_24_28/0.3)] ring-1 ring-night/10 placeholder:text-[#5b646b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night"
          />
        </form>
        <div
          role="group"
          aria-label="Show only one category"
          className="flex shrink-0 gap-2"
        >
          {CATEGORIES.map(({ category: value, label }) => {
            const pressed = category === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={pressed}
                aria-label={label}
                title={label}
                onClick={() => onCategoryChange(pressed ? null : value)}
                className={`flex size-9 items-center justify-center rounded-full shadow-[0_4px_12px_rgb(20_24_28/0.3)] ring-1 ring-night/10 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night ${
                  pressed
                    ? "bg-[#5b646b] text-white"
                    : "bg-white text-[#5b646b] hover:bg-mist/40"
                }`}
                // Static markup from lib/marker-icons, not user content.
                dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[value] }}
              />
            );
          })}
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {matches} {matches === 1 ? "place" : "places"} shown
      </p>
      {matches === 0 && (
        <p className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-xs text-[#5b646b] shadow-[0_4px_12px_rgb(20_24_28/0.2)]">
          No matches
        </p>
      )}
    </div>
  );
}
