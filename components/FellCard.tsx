import { Check, MapPin } from "lucide-react";
import { COMPLETION, type Landmark } from "@/data/landmarks";
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
      aria-label={`${fell.name}${visited ? `, ${COMPLETION.peak.done.toLowerCase()}` : ""}. Open details`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-night text-left text-white shadow-[0_10px_30px_rgb(20_24_28/0.18)] transition duration-300 ease-out hover:shadow-[0_18px_40px_rgb(20_24_28/0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mist-ink motion-safe:hover:-translate-y-1"
    >
      <div className="relative">
        {/* Space for the fell's photo; a dusk placeholder until one is added. */}
        <LandmarkImage
          landmark={fell}
          sizes="(min-width: 1024px) 270px, 50vw"
          className="aspect-[4/3] w-full"
        />
        {ready && visited && (
          <span className="absolute right-2 top-2 inline-flex items-center sm:right-3 sm:top-3 gap-1 rounded-full bg-dusk py-1 pl-1.5 pr-2.5 font-body text-xs font-medium text-night">
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
            {COMPLETION.peak.done}
          </span>
        )}
        {/* Phones have no room beside the name, so the elevation sits on
            the picture there. */}
        {fell.elevationM !== undefined && (
          <span className="absolute bottom-2 left-2 rounded-full bg-dusk px-2 py-0.5 font-heading text-xs font-semibold tabular-nums text-night sm:hidden">
            {formatElevation(fell.elevationM)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3.5 sm:gap-1.5 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="min-w-0 truncate font-heading text-sm font-semibold tracking-tight sm:text-xl">
            {fell.name}
          </h3>
          {fell.elevationM !== undefined && (
            <span className="hidden shrink-0 font-heading text-lg font-medium tabular-nums text-dusk sm:inline">
              {formatElevation(fell.elevationM)}
            </span>
          )}
        </div>
        <p className="flex min-w-0 items-center gap-1.5 font-body text-xs text-night-muted sm:text-sm">
          <MapPin className="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />
          {/* Phones show just the municipality ("Enontekiö"). */}
          <span className="truncate sm:hidden">
            {fell.region.split(",")[0]}
          </span>
          <span className="hidden truncate sm:inline">{fell.region}</span>
        </p>
      </div>
    </button>
  );
}
