import { Check, MapPin } from "lucide-react";
import { COMPLETION, type Landmark } from "@/data/landmarks";
import { formatElevation } from "@/lib/format";

// The bottom half of FellCard on its own (name, height, region), used as the
// map's hover preview. Conquered fells get a small dusk check by the name.
export function FellPreview({
  fell,
  visited,
}: {
  fell: Landmark;
  visited: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl bg-night p-5 text-white shadow-[0_10px_30px_rgb(20_24_28/0.25)]">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="flex min-w-0 items-center gap-2 font-heading text-xl font-semibold tracking-tight">
          <span className="truncate">{fell.name}</span>
          {visited && (
            <span
              className="inline-flex size-5 shrink-0 items-center justify-center self-center rounded-full bg-dusk text-night"
              title={COMPLETION.peak.done}
            >
              <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
              <span className="sr-only">{COMPLETION.peak.done}</span>
            </span>
          )}
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
  );
}
