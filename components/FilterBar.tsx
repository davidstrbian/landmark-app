import { Search } from "lucide-react";
import type { LandmarkCategory } from "@/data/landmarks";

export type CategoryFilter = "all" | LandmarkCategory;

const FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "peak", label: "Peaks" },
  { value: "national-park", label: "National parks" },
  { value: "wilderness-area", label: "Wilderness areas" },
];

type Props = {
  query: string;
  onQueryChange: (query: string) => void;
  category: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  categories: LandmarkCategory[]; // categories present in the list
};

export function FilterBar({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categories,
}: Props) {
  // Chips only make sense when there is more than one category to pick from.
  const filters =
    categories.length > 1
      ? FILTERS.filter((f) => f.value === "all" || categories.includes(f.value))
      : [];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative md:w-80">
        <label htmlFor="landmark-search" className="sr-only">
          Search landmarks by name
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          id="landmark-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by name"
          autoComplete="off"
          className="w-full rounded-2xl border border-border bg-card py-3 pl-12 pr-4 shadow-soft transition placeholder:text-muted focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
      </div>

      {filters.length > 0 && (
        <div
          role="group"
          aria-label="Filter by category"
          className="flex flex-wrap gap-2"
        >
          {filters.map((filter) => {
            const active = filter.value === category;
            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={active}
                onClick={() => onCategoryChange(filter.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "border border-border bg-card text-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
