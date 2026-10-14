import { Check, MapPin } from "lucide-react";
import { COMPLETION, type Landmark } from "@/data/landmarks";
import { formatArea } from "@/lib/format";
import { LandmarkImage } from "./LandmarkImage";

type Props = {
  area: Landmark;
  visited: boolean;
  ready: boolean;
  onOpen: (area: Landmark) => void;
};

// Same shape as FellCard, in the tundra palette.
export function WildernessCard({ area, visited, ready, onOpen }: Props) {
  const done = COMPLETION["wilderness-area"].done;
  return (
    <button
      type="button"
      onClick={() => onOpen(area)}
      aria-haspopup="dialog"
      aria-label={`${area.name}${visited ? `, ${done.toLowerCase()}` : ""}. Open details`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-tundra text-left text-white shadow-[0_10px_30px_rgb(20_24_28/0.16)] transition duration-300 ease-out hover:shadow-[0_18px_40px_rgb(20_24_28/0.26)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mist-ink motion-safe:hover:-translate-y-1"
    >
      <div className="relative">
        {/* Space for the area's photo; a bird placeholder until one is added. */}
        <LandmarkImage
          landmark={area}
          sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
          className="aspect-[4/3] w-full"
        />
        {ready && visited && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-dusk py-1 pl-1.5 pr-2.5 font-body text-xs font-medium text-tundra">
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
            {done}
          </span>
        )}
      </div>

      {/* Two rows like FellCard. Area names are long, so the size sits on
          the second row beside the region. */}
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="min-w-0 truncate font-heading text-xl font-semibold tracking-tight">
          {area.name}
        </h3>
        <div className="flex items-center justify-between gap-3">
          <p className="flex min-w-0 items-center gap-1.5 font-body text-sm text-tundra-muted">
            <MapPin
              className="size-4 shrink-0 self-center"
              aria-hidden="true"
            />
            <span className="truncate">{area.region}</span>
          </p>
          {area.areaKm2 !== undefined && (
            <span className="shrink-0 font-heading text-lg leading-5 font-medium tabular-nums text-dusk lg:text-base xl:text-lg">
              {formatArea(area.areaKm2)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
