import { Check, MapPin } from "lucide-react";
import type { Landmark } from "@/data/landmarks";
import { formatElevation } from "@/lib/format";
import { LandmarkImage } from "./LandmarkImage";

type Props = {
  fell: Landmark;
  visited: boolean;
  ready: boolean;
  onOpen: (fell: Landmark) => void;
};

export function FellCard({ fell, visited, ready, onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={() => onOpen(fell)}
      aria-haspopup="dialog"
      aria-label={`${fell.name}${visited ? ", visited" : ""}. Open details`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-night text-left text-white shadow-[0_10px_30px_rgb(20_24_28/0.18)] transition duration-300 ease-out hover:shadow-[0_18px_40px_rgb(20_24_28/0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mist-ink motion-safe:hover:-translate-y-1"
    >
      <div className="relative">
        {/* Space for the fell's photo; a dusk placeholder until one is added. */}
        <LandmarkImage
          landmark={fell}
          sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
          className="aspect-[4/3] w-full"
        />
        {ready && visited && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-dusk py-1 pl-1.5 pr-2.5 font-body text-xs font-medium text-night">
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
            Visited
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="min-w-0 font-heading text-xl font-semibold tracking-tight">
            {fell.name}
          </h3>
          {fell.elevationM !== undefined && (
            <span className="shrink-0 font-heading text-lg font-medium tabular-nums text-dusk">
              {formatElevation(fell.elevationM)}
            </span>
          )}
        </div>
        <p className="flex min-w-0 items-center gap-1.5 font-body text-sm text-night-muted">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{fell.region}</span>
        </p>
      </div>
    </button>
  );
}
