"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Clock, MapPin, Search, X } from "lucide-react";
import type { Landmark, LandmarkCategory } from "@/data/landmarks";
import { CATEGORY_ICONS } from "@/lib/marker-icons";
import {
  addRecentSearch,
  getRecentSearches,
  removeRecentSearch,
} from "@/lib/recent-searches";
import { normalize } from "@/lib/search";
import { CategoryProgress } from "./CategoryProgress";

const CATEGORIES: { category: LandmarkCategory; label: string }[] = [
  { category: "peak", label: "Fells" },
  { category: "wilderness-area", label: "Wilderness areas" },
  { category: "national-park", label: "National parks" },
];

const MAX_SUGGESTIONS = 6;

// Names whose start, or the start of any word, matches the query: "so" finds
// Sokosti, and "luo" finds Pyhä-Luosto by its second word. Matches at the
// start of the name come first, then alphabetical.
function suggest(landmarks: Landmark[], query: string): Landmark[] {
  const q = normalize(query);
  if (!q) return [];
  const rank = (l: Landmark) => {
    const name = normalize(l.name);
    if (name.startsWith(q)) return 0;
    if (name.split(/[\s\-–]+/).some((word) => word.startsWith(q))) return 1;
    return -1;
  };
  return landmarks
    .map((l) => ({ l, r: rank(l) }))
    .filter(({ r }) => r >= 0)
    .sort((a, b) => a.r - b.r || a.l.name.localeCompare(b.l.name, "fi"))
    .slice(0, MAX_SUGGESTIONS)
    .map(({ l }) => l);
}

type Props = {
  landmarks: Landmark[]; // already narrowed to the active category (all of it)
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: (query: string) => number; // zoom to everything matching; returns the count
  onPick: (landmark: Landmark) => void; // zoom to one landmark
  category: LandmarkCategory | null;
  onCategoryChange: (category: LandmarkCategory | null) => void;
  matches: number;
  visited: Set<string>;
  ready: boolean;
};

type Option =
  | { kind: "landmark"; landmark: Landmark }
  | { kind: "recent"; text: string };

// The map's top-left controls: a search box with suggestions and recent
// searches (an ARIA combobox), and one round button per category using the
// markers' symbols. A pressed button shows only its category and swaps to
// inverted colours; pressing it again shows everything.
export function MapSearch({
  landmarks,
  query,
  onQueryChange,
  onSubmit,
  onPick,
  category,
  onCategoryChange,
  matches,
  visited,
  ready,
}: Props) {
  const id = useId();
  const listId = `${id}-list`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);
  // Loaded when the box is first focused, so the server render stays empty.
  const [recent, setRecent] = useState<string[] | null>(null);

  const options: Option[] = useMemo(
    () =>
      query.trim()
        ? suggest(landmarks, query).map((landmark) => ({
            kind: "landmark" as const,
            landmark,
          }))
        : (recent ?? []).map((text) => ({ kind: "recent" as const, text })),
    [landmarks, query, recent],
  );
  const showList = open && options.length > 0;

  const remember = (text: string) =>
    setRecent((list) => addRecentSearch(list ?? getRecentSearches(), text));

  const choose = (option: Option) => {
    setOpen(false);
    setActive(-1);
    if (option.kind === "landmark") {
      onQueryChange(option.landmark.name);
      remember(option.landmark.name);
      onPick(option.landmark);
    } else {
      onQueryChange(option.text);
      remember(option.text);
      onSubmit(option.text);
    }
  };

  const forget = (text: string) => {
    setRecent((list) => removeRecentSearch(list ?? [], text));
    setActive(-1);
  };

  const optionId = (i: number) => `${id}-option-${i}`;

  return (
    <div className="absolute left-3 right-14 top-3 z-10 font-body sm:right-auto">
      <div className="flex items-start gap-2">
        <form
          role="search"
          className="relative min-w-0 flex-1 sm:w-72 sm:flex-none"
          onSubmit={(event) => {
            event.preventDefault();
            if (active >= 0 && options[active]) {
              choose(options[active]);
              return;
            }
            setOpen(false);
            // Only searches that found something are worth remembering.
            if (query.trim() && onSubmit(query) > 0) remember(query);
          }}
        >
          <label htmlFor={`${id}-input`} className="sr-only">
            Search the map by name
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-[1.125rem] size-4 -translate-y-1/2 text-[#5b646b]"
            aria-hidden="true"
          />
          {/* 16px text on phones: smaller text makes mobile browsers zoom in
              when the box is tapped. */}
          <input
            ref={inputRef}
            id={`${id}-input`}
            type="search"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              showList && active >= 0 ? optionId(active) : undefined
            }
            value={query}
            onChange={(event) => {
              onQueryChange(event.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => {
              if (recent === null) setRecent(getRecentSearches());
              setOpen(true);
              setFocused(true);
            }}
            onBlur={() => {
              setFocused(false);
              setOpen(false);
              setActive(-1);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                if (!showList) {
                  setOpen(true);
                  return;
                }
                const step = event.key === "ArrowDown" ? 1 : -1;
                setActive((i) =>
                  i === -1 && step === -1
                    ? options.length - 1
                    : (i + step + options.length) % options.length,
                );
              } else if (event.key === "Escape" && showList) {
                event.preventDefault();
                setOpen(false);
                setActive(-1);
              } else if (
                event.key === "Delete" &&
                showList &&
                active >= 0 &&
                options[active]?.kind === "recent"
              ) {
                // Keyboard equivalent of a recent search's X button.
                event.preventDefault();
                const option = options[active];
                if (option.kind === "recent") forget(option.text);
              }
            }}
            placeholder="Search by name"
            autoComplete="off"
            className={`h-9 w-full rounded-full bg-white pl-10 text-base sm:text-sm [&::-webkit-search-cancel-button]:appearance-none ${query ? "pr-9" : "pr-3"} text-mist-ink shadow-[0_4px_12px_rgb(20_24_28/0.3)] ring-1 ring-night/10 placeholder:text-[#5b646b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night`}
          />
          {/* Replaces the browser's own clear button, which doesn't match. */}
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                onQueryChange("");
                setActive(-1);
                inputRef.current?.focus();
              }}
              className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full text-[#5b646b] transition-colors hover:bg-mist/60 hover:text-mist-ink focus-visible:outline-2 focus-visible:outline-night"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}

          {showList && (
            <div
              // Keeps focus in the input while clicking the list.
              onMouseDown={(event) => event.preventDefault()}
              className="absolute inset-x-0 top-11 overflow-hidden rounded-2xl bg-white py-1.5 shadow-[0_10px_30px_rgb(20_24_28/0.25)] ring-1 ring-night/10"
            >
              {!query.trim() && (
                <p className="px-4 pb-1 pt-1.5 text-xs font-medium uppercase tracking-wide text-[#5b646b]">
                  Recent searches
                </p>
              )}
              <ul id={listId} role="listbox" aria-label="Suggestions">
                {options.map((option, i) => (
                  <li
                    key={
                      option.kind === "landmark"
                        ? option.landmark.id
                        : `recent-${option.text}`
                    }
                    id={optionId(i)}
                    role="option"
                    aria-selected={i === active}
                    onClick={() => choose(option)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm text-mist-ink ${
                      i === active ? "bg-mist/40" : ""
                    }`}
                  >
                    {option.kind === "landmark" ? (
                      <>
                        <span
                          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-mist/40 text-[#5b646b] [&_svg]:max-h-4 [&_svg]:max-w-5"
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{
                            __html: CATEGORY_ICONS[option.landmark.category],
                          }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">
                            {option.landmark.name}
                          </span>
                          <span className="flex min-w-0 items-center gap-1 text-xs text-[#5b646b]">
                            <MapPin
                              className="size-3 shrink-0"
                              aria-hidden="true"
                            />
                            <span className="truncate">
                              {option.landmark.region}
                            </span>
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock
                          className="ml-1.5 size-4 shrink-0 text-[#5b646b]"
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1 truncate">
                          {option.text}
                        </span>
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-label={`Remove ${option.text} from recent searches`}
                          title="Remove"
                          onClick={(event) => {
                            event.stopPropagation();
                            forget(option.text);
                          }}
                          className="-my-1 flex size-7 shrink-0 items-center justify-center rounded-full text-[#5b646b] transition-colors hover:bg-mist/60 hover:text-mist-ink"
                        >
                          <X className="size-4" aria-hidden="true" />
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
        {/* CategoryProgress's phone width subtracts these buttons (size-9,
            gap-2): change both together. */}
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
      {/* Out of the way while searching: hidden while the box is in use or
          holds a search. */}
      {category && !focused && !query.trim() && (
        <CategoryProgress
          // Remounts per category, so the percentage counts up again.
          key={category}
          category={category}
          landmarks={landmarks}
          visited={visited}
          ready={ready}
        />
      )}
      <p aria-live="polite" className="sr-only">
        {matches} {matches === 1 ? "place" : "places"} shown
      </p>
      {matches === 0 && !showList && (
        <p className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-xs text-[#5b646b] shadow-[0_4px_12px_rgb(20_24_28/0.2)]">
          No matches
        </p>
      )}
    </div>
  );
}
