"use client";

import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { CATEGORY_LABELS, type Landmark } from "@/data/landmarks";
import { formatArea, formatElevation } from "@/lib/format";
import { LandmarkImage } from "./LandmarkImage";

type Props = {
  landmark: Landmark | null;
  visited: boolean;
  onToggleVisited: (id: string) => void;
  onClose: () => void;
};

// Native <dialog> opened with showModal(): the browser handles the focus trap,
// Esc to close, and returning focus to the card that opened it.
export function LandmarkDialog({
  landmark,
  visited,
  onToggleVisited,
  onClose,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (landmark && !dialog.open) dialog.showModal();
    if (!landmark && dialog.open) dialog.close();
  }, [landmark]);

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
    <dialog
      ref={ref}
      aria-labelledby="landmark-dialog-title"
      onClose={onClose}
      // A click whose target is the <dialog> itself landed on the backdrop.
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-3xl bg-card p-0 text-foreground shadow-lift"
    >
      {landmark && (
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-y-auto">
          <div className="relative shrink-0">
            <LandmarkImage
              key={landmark.id}
              landmark={landmark}
              sizes="(min-width: 640px) 576px, 100vw"
              className="aspect-[16/9] w-full"
            />
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-card/90 text-foreground shadow-soft backdrop-blur transition hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

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
        </div>
      )}
    </dialog>
  );
}
