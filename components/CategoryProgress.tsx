"use client";

import {
  COMPLETION,
  type Landmark,
  type LandmarkCategory,
} from "@/data/landmarks";
import { useCountUp } from "@/hooks/use-count-up";
import { PREVIEW_TONES } from "./LandmarkPreview";

const LABELS: Record<LandmarkCategory, string> = {
  peak: "Finnish Fells",
  "wilderness-area": "Wilderness Areas",
  "national-park": "National Parks",
};

// Completion for the category picked in the map's filter, in that section's
// card colour like the home page's progress tiles. The percentage counts up
// each time a category is picked.
export function CategoryProgress({
  category,
  landmarks,
  visited,
  ready,
}: {
  category: LandmarkCategory;
  landmarks: Landmark[]; // every landmark in the category
  visited: Set<string>;
  ready: boolean;
}) {
  const total = landmarks.length;
  const done = landmarks.filter((l) => visited.has(l.id)).length;
  const percent = total === 0 ? 0 : (done / total) * 100;
  const shown = useCountUp(percent, ready, 900);
  const tone = PREVIEW_TONES[category];

  return (
    <div
      className={`mt-2 w-full rounded-2xl px-4 py-3 text-white shadow-[0_10px_30px_rgb(20_24_28/0.25)] sm:w-72 ${tone.bg}`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-heading font-medium">
            {LABELS[category]}
          </p>
          <p className={`text-xs ${tone.muted}`}>
            {ready ? done : "–"} of {total}{" "}
            {COMPLETION[category].done.toLowerCase()}
          </p>
        </div>
        <p
          aria-hidden="true"
          className="shrink-0 font-heading text-2xl font-semibold tabular-nums text-dusk"
        >
          {Math.round(shown)}
          <span className="text-sm">%</span>
        </p>
      </div>
      <div
        role="progressbar"
        aria-label={`${LABELS[category]} ${COMPLETION[category].done.toLowerCase()}`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={ready ? done : undefined}
        aria-valuetext={
          ready ? `${done} of ${total} (${Math.round(percent)}%)` : "Loading"
        }
        className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/15"
      >
        <div
          className="h-full rounded-full bg-dusk"
          style={{ width: `${shown}%` }}
        />
      </div>
    </div>
  );
}
