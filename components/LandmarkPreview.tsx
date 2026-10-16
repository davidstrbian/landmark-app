import { Check, MapPin } from "lucide-react";
import {
  COMPLETION,
  type Landmark,
  type LandmarkCategory,
} from "@/data/landmarks";
import { formatElevation } from "@/lib/format";

// Card colours per category, matching the home page cards. `fill` is used by
// the map preview's pointer triangle.
export const PREVIEW_TONES: Record<
  LandmarkCategory,
  { bg: string; muted: string; check: string; fill: string }
> = {
  peak: {
    bg: "bg-night",
    muted: "text-night-muted",
    check: "text-night",
    fill: "fill-night",
  },
  "wilderness-area": {
    bg: "bg-tundra",
    muted: "text-tundra-muted",
    check: "text-tundra",
    fill: "fill-tundra",
  },
  "national-park": {
    bg: "bg-forest",
    muted: "text-forest-muted",
    check: "text-forest",
    fill: "fill-forest",
  },
};

// What each category is called in the preview's small type label.
const TYPE_LABELS: Record<LandmarkCategory, string> = {
  peak: "Fell",
  "wilderness-area": "Wilderness area",
  "national-park": "National park",
};

// The bottom half of a home-page card on its own (name, region, and a fell's
// height) plus a small label naming its type, used as the map's hover preview. Completed landmarks get a small
// dusk check by the name.
export function LandmarkPreview({
  landmark,
  visited,
}: {
  landmark: Landmark;
  visited: boolean;
}) {
  const tone = PREVIEW_TONES[landmark.category];
  const done = COMPLETION[landmark.category].done;
  return (
    <div
      className={`flex flex-col gap-1.5 rounded-2xl p-5 text-white shadow-[0_10px_30px_rgb(20_24_28/0.25)] ${tone.bg}`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="flex min-w-0 items-center gap-2 font-heading text-xl font-semibold tracking-tight">
          <span className="truncate">{landmark.name}</span>
          {visited && (
            <span
              className={`inline-flex size-5 shrink-0 items-center justify-center self-center rounded-full bg-dusk ${tone.check}`}
              title={done}
            >
              <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
              <span className="sr-only">{done}</span>
            </span>
          )}
        </h3>
        {landmark.category === "peak" && landmark.elevationM !== undefined && (
          <span className="shrink-0 font-heading text-lg font-medium tabular-nums text-dusk">
            {formatElevation(landmark.elevationM)}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <p
          className={`flex min-w-0 items-center gap-1.5 font-body text-sm ${tone.muted}`}
        >
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {/* Wilderness areas show just the region ("Lapland"); the
                municipality stays in the data. */}
            {landmark.category === "wilderness-area"
              ? landmark.region.split(",").at(-1)?.trim()
              : landmark.region}
          </span>
        </p>
        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 font-body text-[0.6875rem] font-medium uppercase tracking-wide text-white/85">
          {TYPE_LABELS[landmark.category]}
        </span>
      </div>
    </div>
  );
}
