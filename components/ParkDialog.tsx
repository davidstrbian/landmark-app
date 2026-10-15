"use client";

import { Check } from "lucide-react";
import { COMPLETION, type Landmark } from "@/data/landmarks";
import { formatArea } from "@/lib/format";
import { FactTile } from "./FactTile";
import { LandmarkImage } from "./LandmarkImage";
import { Modal } from "./Modal";
import { NatureTypes } from "./NatureTypes";

type Props = {
  park: Landmark | null;
  visited: boolean;
  onToggleVisited: (id: string) => void;
  onClose: () => void;
};

// Mirrors WildernessDialog: size where the size is, the year established
// where the wilderness score is, and the park's nature types where the
// reindeer likelihood is.
export function ParkDialog({ park, visited, onToggleVisited, onClose }: Props) {
  const completion = COMPLETION["national-park"];

  return (
    <Modal
      open={park !== null}
      onClose={onClose}
      labelledBy="park-dialog-title"
      className="bg-forest text-white"
      closeButtonClassName="bg-forest/80 text-white hover:bg-forest focus-visible:outline-dusk"
    >
      {park && (
        <>
          <LandmarkImage
            key={park.id}
            landmark={park}
            sizes="(min-width: 704px) 672px, 100vw"
            className="aspect-[4/1] w-full shrink-0"
          />

          <div className="p-4 sm:px-7 sm:py-6">
            <p className="font-body text-sm text-dusk">{park.region}</p>
            <h2
              id="park-dialog-title"
              className="mt-0.5 font-heading text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              {park.name}
            </h2>
            <p className="mt-3 font-body text-sm leading-relaxed sm:text-[0.9375rem] text-forest-muted">
              {park.description}
            </p>

            <dl className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-2.5">
              {/* Whole km². The sea parks have no size and show a dash. */}
              <FactTile label="Size" tone="forest">
                <span className="tabular-nums">
                  {park.areaKm2 !== undefined
                    ? formatArea(Math.round(park.areaKm2))
                    : "–"}
                </span>
              </FactTile>
              <FactTile label="Established" tone="forest">
                {park.established !== undefined && (
                  <span className="tabular-nums">{park.established}</span>
                )}
              </FactTile>
              <FactTile label="Nature" tone="forest" wide>
                {park.nature && park.nature.length > 0 && (
                  <NatureTypes types={park.nature} />
                )}
              </FactTile>
            </dl>

            <button
              type="button"
              onClick={() => onToggleVisited(park.id)}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 sm:mt-4 font-body font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk ${
                visited
                  ? "border border-dusk/40 bg-dusk/10 text-dusk hover:bg-dusk/20"
                  : "bg-dusk text-forest hover:bg-dusk/90"
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
              <p className="mt-2 text-center font-body text-xs text-forest-muted">
                Tap again to undo.
              </p>
            )}

            {park.imageCredit && (
              <p className="mt-4 font-body text-xs text-forest-muted">
                Photo: {park.imageCredit}
              </p>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
