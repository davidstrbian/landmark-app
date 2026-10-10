import { Check, MapPin } from "lucide-react";
import { CATEGORY_LABELS, type Landmark } from "@/data/landmarks";
import { keyFact } from "@/lib/format";
import { LandmarkImage } from "./LandmarkImage";

type Props = {
  landmark: Landmark;
  visited: boolean;
  ready: boolean;
  preload?: boolean;
  onOpen: (landmark: Landmark) => void;
};

export function LandmarkCard({
  landmark,
  visited,
  ready,
  preload,
  onOpen,
}: Props) {
  const fact = keyFact(landmark);

  return (
    <button
      type="button"
      onClick={() => onOpen(landmark)}
      aria-haspopup="dialog"
      aria-label={`${landmark.name}${visited ? ", visited" : ""}. Open details`}
      className={`group flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-card text-left shadow-soft transition duration-300 ease-out hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-safe:hover:-translate-y-1 ${
        visited ? "border-primary/40" : "border-border"
      }`}
    >
      <div className="relative">
        <LandmarkImage
          landmark={landmark}
          sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
          preload={preload}
          className="aspect-[4/3] w-full"
        />
        {ready && visited && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary py-1 pl-1.5 pr-2.5 text-xs font-medium text-primary-foreground shadow-soft">
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
            Visited
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-lg font-semibold leading-snug tracking-tight text-pretty">
            {landmark.name}
          </h3>
          <span className="mt-0.5 shrink-0 rounded-full bg-subtle px-2.5 py-0.5 text-xs font-medium text-muted">
            {CATEGORY_LABELS[landmark.category]}
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 text-sm text-muted">
          <span className="flex min-w-0 items-center gap-1.5">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{landmark.region}</span>
          </span>
          {fact && (
            <span className="shrink-0 font-medium tabular-nums text-foreground">
              {fact}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
