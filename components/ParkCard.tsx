import { Check, MapPin } from "lucide-react";
import { COMPLETION, type Landmark } from "@/data/landmarks";
import { LandmarkImage } from "./LandmarkImage";

type Props = {
  park: Landmark;
  visited: boolean;
  ready: boolean;
  onOpen: (park: Landmark) => void;
};

// Same shape as WildernessCard, in the forest palette.
export function ParkCard({ park, visited, ready, onOpen }: Props) {
  const done = COMPLETION["national-park"].done;
  return (
    <button
      type="button"
      onClick={() => onOpen(park)}
      aria-haspopup="dialog"
      aria-label={`${park.name}${visited ? `, ${done.toLowerCase()}` : ""}. Open details`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-forest text-left text-white shadow-[0_10px_30px_rgb(20_32_26/0.14)] transition duration-300 ease-out hover:shadow-[0_18px_40px_rgb(20_32_26/0.24)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-safe:hover:-translate-y-1"
    >
      <div className="relative">
        {/* Space for the park's photo; a spruce placeholder until one is added. */}
        <LandmarkImage
          landmark={park}
          sizes="(min-width: 1024px) 270px, 50vw"
          className="aspect-[4/3] w-full"
        />
        {ready && visited && (
          <span className="absolute right-2 top-2 inline-flex items-center sm:right-3 sm:top-3 gap-1 rounded-full bg-dusk py-1 pl-1.5 pr-2.5 font-body text-xs font-medium text-forest">
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
            {done}
          </span>
        )}
      </div>

      {/* Name on the first row, region on the second, as in WildernessCard.
          Size is in the dialog. */}
      <div className="flex flex-1 flex-col gap-1 p-3.5 sm:gap-1.5 sm:p-5">
        <h3 className="min-w-0 truncate font-heading text-sm font-semibold tracking-tight sm:text-xl lg:text-lg">
          {park.name}
        </h3>
        <p className="flex min-w-0 items-center gap-1.5 font-body text-xs text-forest-muted sm:text-sm">
          <MapPin className="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />
          <span className="truncate">{park.region}</span>
        </p>
      </div>
    </button>
  );
}
