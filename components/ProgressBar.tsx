import type { Landmark, LandmarkCategory } from "@/data/landmarks";

const CATEGORY_SHORT: Record<LandmarkCategory, string> = {
  peak: "Peaks",
  "national-park": "Parks",
  other: "Other",
};

type Props = {
  landmarks: Landmark[];
  visited: Set<string>;
  ready: boolean;
};

// Always overall progress across every landmark, independent of filters.
export function ProgressBar({ landmarks, visited, ready }: Props) {
  const total = landmarks.length;
  const count = landmarks.filter((l) => visited.has(l.id)).length;
  const percent = total === 0 ? 0 : Math.round((count / total) * 100);

  const categories = (Object.keys(CATEGORY_SHORT) as LandmarkCategory[]).map(
    (category) => {
      const inCategory = landmarks.filter((l) => l.category === category);
      return {
        category,
        label: CATEGORY_SHORT[category],
        done: inCategory.filter((l) => visited.has(l.id)).length,
        total: inCategory.length,
      };
    },
  );

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        {ready ? (
          <p className="text-lg">
            <span className="text-4xl font-semibold tracking-tight tabular-nums">
              {count}
            </span>
            <span className="text-muted"> of {total} landmarks visited</span>
          </p>
        ) : (
          <div
            className="h-10 w-64 max-w-full animate-pulse rounded-xl bg-subtle"
            aria-hidden="true"
          />
        )}
        {ready ? (
          <p className="text-2xl font-semibold tabular-nums text-primary">
            {percent}%
          </p>
        ) : (
          <div
            className="h-8 w-16 animate-pulse rounded-xl bg-subtle"
            aria-hidden="true"
          />
        )}
      </div>

      <div
        role="progressbar"
        aria-label="Landmarks visited"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={ready ? count : undefined}
        aria-valuetext={ready ? `${count} of ${total} (${percent}%)` : "Loading"}
        aria-busy={!ready}
        className="mt-5 h-3 w-full overflow-hidden rounded-full bg-subtle"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
          style={{ width: `${ready ? percent : 0}%` }}
        />
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        {categories.map((c) => (
          <li key={c.category} className="tabular-nums">
            {c.label}{" "}
            <span className="font-medium text-foreground">
              {ready ? c.done : "–"}/{c.total}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
