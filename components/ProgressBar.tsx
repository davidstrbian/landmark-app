"use client";

import type { Landmark, LandmarkCategory } from "@/data/landmarks";
import { useCountUp } from "@/hooks/use-count-up";

// One small bar per section, on a tile in that section's card colour. The
// fills all use the dusk accent so the panel reads as one piece.
const CATEGORIES: {
  category: LandmarkCategory;
  label: string;
  href: string;
  tile: string;
  muted: string;
}[] = [
  {
    category: "peak",
    label: "Finnish Fells",
    href: "#fells",
    tile: "bg-night-raised",
    muted: "text-night-muted",
  },
  {
    category: "wilderness-area",
    label: "Wilderness Areas",
    href: "#wilderness",
    tile: "bg-tundra",
    muted: "text-tundra-muted",
  },
  {
    category: "national-park",
    label: "National Parks",
    href: "#landmarks",
    tile: "bg-forest",
    muted: "text-forest-muted",
  },
];

type Props = {
  landmarks: Landmark[];
  visited: Set<string>;
  ready: boolean;
};

function percentOf(done: number, total: number) {
  return total === 0 ? 0 : (done / total) * 100;
}

// Overall progress across every landmark, plus one bar per category. The
// percentage counts up from 0 on every page load.
export function ProgressBar({ landmarks, visited, ready }: Props) {
  const total = landmarks.length;
  const count = landmarks.filter((l) => visited.has(l.id)).length;
  const percent = percentOf(count, total);
  const shown = useCountUp(percent, ready);

  const categories = CATEGORIES.map((c) => {
    const inCategory = landmarks.filter((l) => l.category === c.category);
    return {
      ...c,
      done: inCategory.filter((l) => visited.has(l.id)).length,
      total: inCategory.length,
    };
  }).filter((c) => c.total > 0);

  return (
    <div className="font-body text-white">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h2
            id="progress-heading"
            className="font-heading text-[clamp(1.5rem,2.35vw,2.75rem)] font-medium leading-tight tracking-tight"
          >
            Your Progress
          </h2>
          {ready ? (
            <p className="mt-2 text-night-muted">
              <span className="font-medium tabular-nums text-white">
                {count}
              </span>{" "}
              of {total} landmarks completed
            </p>
          ) : (
            <div
              className="mt-2 h-6 w-56 max-w-full animate-pulse rounded-lg bg-night-raised"
              aria-hidden="true"
            />
          )}
        </div>
        <p
          aria-hidden="true"
          className="font-heading text-[clamp(3rem,6vw,5rem)] font-semibold leading-none tracking-tight tabular-nums text-dusk"
        >
          {Math.round(shown)}
          <span className="text-[0.5em]">%</span>
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Landmarks completed"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={ready ? count : undefined}
        aria-valuetext={
          ready
            ? `${count} of ${total} (${Math.round(percent)}%)`
            : "Loading"
        }
        aria-busy={!ready}
        className="mt-6 h-3.5 w-full overflow-hidden rounded-full bg-night-raised"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#c98a66] to-dusk"
          style={{ width: `${shown}%` }}
        />
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {categories.map((c) => {
          const p = percentOf(c.done, c.total);
          return (
            <li key={c.category} className="min-w-0">
              <a
                href={c.href}
                className={`block rounded-2xl p-5 transition duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk ${c.tile}`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate font-heading text-sm font-medium md:text-base">
                    {c.label}
                  </span>
                  <span className={`shrink-0 text-sm tabular-nums ${c.muted}`}>
                    {ready ? c.done : "–"}/{c.total}
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${c.label} completed`}
                  aria-valuemin={0}
                  aria-valuemax={c.total}
                  aria-valuenow={ready ? c.done : undefined}
                  aria-busy={!ready}
                  className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10"
                >
                  <div
                    className="h-full rounded-full bg-dusk transition-[width] duration-[1400ms] ease-out"
                    style={{ width: `${ready ? p : 0}%` }}
                  />
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
