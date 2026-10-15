"use client";

import { Check } from "lucide-react";
import { COMPLETION, type Landmark } from "@/data/landmarks";
import { formatArea } from "@/lib/format";
import { FactTile } from "./FactTile";
import { LandmarkImage } from "./LandmarkImage";
import { Modal } from "./Modal";
import { ReindeerMeter } from "./ReindeerMeter";
import { StarRating } from "./StarRating";

type Props = {
  area: Landmark | null;
  visited: boolean;
  onToggleVisited: (id: string) => void;
  onClose: () => void;
};

// Mirrors FellDialog: size where coordinates are, wilderness score where
// difficulty is, reindeer sighting likelihood where the typical hike is.
export function WildernessDialog({
  area,
  visited,
  onToggleVisited,
  onClose,
}: Props) {
  const completion = COMPLETION["wilderness-area"];

  return (
    <Modal
      open={area !== null}
      onClose={onClose}
      labelledBy="wilderness-dialog-title"
      className="bg-tundra text-white"
      closeButtonClassName="bg-tundra/80 text-white hover:bg-tundra focus-visible:outline-dusk"
    >
      {area && (
        <>
          <LandmarkImage
            key={area.id}
            landmark={area}
            sizes="(min-width: 640px) 576px, 100vw"
            className="aspect-[16/9] w-full shrink-0"
          />

          <div className="p-6 sm:p-8">
            <p className="font-body text-sm text-dusk">{area.region}</p>
            <h2
              id="wilderness-dialog-title"
              className="mt-1 font-heading text-3xl font-semibold tracking-tight"
            >
              {area.name}
            </h2>
            <p className="mt-4 font-body leading-relaxed text-tundra-muted">
              {area.description}
            </p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              <FactTile label="Size" tone="tundra">
                {area.areaKm2 !== undefined && (
                  <span className="tabular-nums">
                    {formatArea(area.areaKm2)}
                  </span>
                )}
              </FactTile>
              <FactTile label="Wilderness score" tone="tundra">
                {area.wildernessScore !== undefined && (
                  <span className="mt-0.5 block">
                    <StarRating
                      value={area.wildernessScore}
                      label="Wilderness score"
                    />
                  </span>
                )}
              </FactTile>
              <FactTile
                label="Reindeer sighting likelihood"
                note={area.notes?.reindeer}
                tone="tundra"
                wide
              >
                {area.reindeer && (
                  <>
                    <ReindeerMeter level={area.reindeer} />
                    {area.reindeerBasis && (
                      <span className="mt-3 block text-sm leading-relaxed text-tundra-muted">
                        {area.reindeerBasis}
                      </span>
                    )}
                  </>
                )}
              </FactTile>
            </dl>

            <button
              type="button"
              onClick={() => onToggleVisited(area.id)}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-body font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk ${
                visited
                  ? "border border-dusk/40 bg-dusk/10 text-dusk hover:bg-dusk/20"
                  : "bg-dusk text-tundra hover:bg-dusk/90"
              }`}
            >
              {visited ? (
                <>
                  <Check
                    className="size-5"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  {completion.done}
                </>
              ) : (
                completion.action
              )}
            </button>
            {visited && (
              <p className="mt-2 text-center font-body text-xs text-tundra-muted">
                Tap again to undo.
              </p>
            )}

            {area.imageCredit && (
              <p className="mt-6 font-body text-xs text-tundra-muted">
                Photo: {area.imageCredit}
              </p>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
