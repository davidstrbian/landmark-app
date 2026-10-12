"use client";

import { Check } from "lucide-react";
import { CATEGORY_LABELS, type Landmark } from "@/data/landmarks";
import { formatArea, formatElevation } from "@/lib/format";
import { LandmarkImage } from "./LandmarkImage";
import { Modal } from "./Modal";

type Props = {
  landmark: Landmark | null;
  visited: boolean;
  onToggleVisited: (id: string) => void;
  onClose: () => void;
};

export function LandmarkDialog({
  landmark,
  visited,
  onToggleVisited,
  onClose,
}: Props) {
  const facts = landmark
    ? [
        landmark.elevationM !== undefined && {
          label: "Elevation",
          value: formatElevation(landmark.elevationM),
        },
        landmark.areaKm2 !== undefined && {
          label: "Area",
          value: formatArea(landmark.areaKm2),
        },
        landmark.bestSeason && {
          label: "Best season",
          value: landmark.bestSeason,
        },
        landmark.nearestTown && {
          label: "Nearest town",
          value: landmark.nearestTown,
        },
      ].filter((fact): fact is { label: string; value: string } => !!fact)
    : [];

  return (
    <Modal
      open={landmark !== null}
      onClose={onClose}
      labelledBy="landmark-dialog-title"
      className="bg-card text-foreground"
      closeButtonClassName="bg-card/90 text-foreground hover:bg-card focus-visible:outline-primary"
    >
      {landmark && (
        <>
          <LandmarkImage
            key={landmark.id}
            landmark={landmark}
            sizes="(min-width: 640px) 576px, 100vw"
            className="aspect-[16/9] w-full shrink-0"
          />

          <div className="p-6 sm:p-8">
            <p className="text-sm font-medium text-primary">
              {CATEGORY_LABELS[landmark.category]} · {landmark.region}
            </p>
            <h2
              id="landmark-dialog-title"
              className="mt-1 text-3xl font-semibold tracking-tight"
            >
              {landmark.name}
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              {landmark.description}
            </p>

            {facts.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-3">
                {facts.map((fact) => (
                  <div key={fact.label} className="rounded-2xl bg-subtle p-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 font-medium tabular-nums">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <button
              type="button"
              onClick={() => onToggleVisited(landmark.id)}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                visited
                  ? "border border-primary/30 bg-primary-soft text-primary hover:bg-primary-soft/70"
                  : "bg-primary text-primary-foreground hover:bg-primary-hover"
              }`}
            >
              {visited ? (
                <>
                  <Check className="size-5" strokeWidth={2.5} aria-hidden="true" />
                  Visited
                </>
              ) : (
                "Mark as visited"
              )}
            </button>
            {visited && (
              <p className="mt-2 text-center text-xs text-muted">
                Tap again to undo.
              </p>
            )}

            {landmark.imageCredit && (
              <p className="mt-6 text-xs text-muted">
                Photo: {landmark.imageCredit}
              </p>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
