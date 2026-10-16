"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { COMPLETION, type FellField, type Landmark } from "@/data/landmarks";
import { formatElevation } from "@/lib/format";
import { FactTile } from "./FactTile";
import { LandmarkImage } from "./LandmarkImage";
import { Modal } from "./Modal";
import { StarRating } from "./StarRating";

type Props = {
  fell: Landmark | null;
  visited: boolean;
  onToggleVisited: (id: string) => void;
  onClose: () => void;
};

function formatCoordinates(lat: number, lng: number) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
}

// Shows the coordinates; clicking copies them in plain decimal form
// ("69.3081, 21.2633"), which map apps and GPS devices accept.
function CopyCoordinates({ lat, lng }: { lat: number; lng: number }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${lat}, ${lng}`);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy coordinates"
      className="group/copy relative -mx-1 inline-flex items-center gap-2 rounded-lg px-1 text-left transition hover:text-dusk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk"
    >
      <span className="whitespace-nowrap tabular-nums">
        {formatCoordinates(lat, lng)}
      </span>
      {status === "copied" ? (
        <Check className="size-4 shrink-0 text-dusk" aria-hidden="true" />
      ) : (
        <Copy
          className="size-4 shrink-0 text-night-muted transition group-hover/copy:text-dusk"
          aria-hidden="true"
        />
      )}
      <span className="sr-only">Copy coordinates</span>
      <span
        aria-live="polite"
        // Kept in the DOM so screen readers announce the change.
        className={`pointer-events-none absolute -top-7 right-0 rounded-md bg-dusk px-2 py-0.5 font-body text-xs font-medium whitespace-nowrap text-night transition-opacity ${
          status === "idle" ? "opacity-0" : "opacity-100"
        }`}
      >
        {status === "copied" && "Copied"}
        {status === "failed" && "Couldn't copy"}
      </span>
    </button>
  );
}

export function FellDialog({ fell, visited, onToggleVisited, onClose }: Props) {
  const note = (field: FellField) => fell?.notes?.[field];

  return (
    <Modal
      open={fell !== null}
      onClose={onClose}
      labelledBy="fell-dialog-title"
      className="bg-night text-white"
      closeButtonClassName="bg-night/80 text-white hover:bg-night focus-visible:outline-dusk"
    >
      {fell && (
        <>
          <LandmarkImage
            key={fell.id}
            landmark={fell}
            sizes="(min-width: 640px) 640px, 100vw"
            className="aspect-[4/1] w-full shrink-0 sm:aspect-[2/1]"
          />

          <div className="p-4 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-body text-sm text-dusk">{fell.region}</p>
                <h2
                  id="fell-dialog-title"
                  className="mt-0.5 font-heading text-2xl font-semibold tracking-tight sm:mt-1 sm:text-[2.125rem]"
                >
                  {fell.name}
                </h2>
              </div>
              {fell.elevationM !== undefined && (
                <div className="shrink-0 rounded-2xl bg-dusk px-4 py-2.5 text-right text-night">
                  <p className="font-heading text-2xl font-semibold leading-none tabular-nums">
                    {formatElevation(fell.elevationM)}
                  </p>
                  <p className="mt-1.5 font-body text-[0.6875rem] font-medium uppercase tracking-wide">
                    Above sea level
                  </p>
                </div>
              )}
            </div>
            <p className="mt-3 font-body text-sm leading-relaxed sm:mt-4 sm:text-lg text-night-muted">
              {fell.description}
            </p>

            <dl className="mt-3 grid gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-3">
              <FactTile label="Coordinates" note={note("coordinates")}>
                {fell.lat !== undefined && fell.lng !== undefined && (
                  <CopyCoordinates
                    key={fell.id}
                    lat={fell.lat}
                    lng={fell.lng}
                  />
                )}
              </FactTile>
              <FactTile label="Difficulty" note={note("difficulty")}>
                {fell.difficulty !== undefined && (
                  <span className="mt-0.5 block">
                    <StarRating value={fell.difficulty} label="Difficulty" />
                  </span>
                )}
              </FactTile>
              <FactTile label="Typical hike" note={note("hike")} wide>
                {fell.hike && (
                  <>
                    {fell.hike.name && (
                      <span className="block font-medium">
                        {fell.hike.name}
                      </span>
                    )}
                    <dl className="mt-2 grid grid-cols-3 gap-3 sm:mt-3">
                      {[
                        { label: "Distance", value: fell.hike.distance },
                        { label: "Duration", value: fell.hike.duration },
                        {
                          label: "Elevation change",
                          value:
                            fell.hike.elevationGainM !== undefined
                              ? `+${formatElevation(fell.hike.elevationGainM)}`
                              : undefined,
                        },
                      ]
                        .filter((stat) => stat.value)
                        .map((stat) => (
                          <div key={stat.label} className="min-w-0">
                            <dt className="text-xs text-night-muted">
                              {stat.label}
                            </dt>
                            <dd className="mt-0.5 font-medium tabular-nums">
                              {stat.value}
                            </dd>
                          </div>
                        ))}
                    </dl>
                    <span className="mt-2 block text-sm text-night-muted sm:mt-3">
                      From {fell.hike.trailhead}
                    </span>
                  </>
                )}
              </FactTile>
            </dl>

            <button
              type="button"
              onClick={() => onToggleVisited(fell.id)}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 sm:mt-6 sm:py-3.5 font-body font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk ${
                visited
                  ? "border border-dusk/40 bg-dusk/10 text-dusk hover:bg-dusk/20"
                  : "bg-dusk text-night hover:bg-dusk/90"
              }`}
            >
              {visited ? (
                <>
                  <Check
                    className="size-5"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  {COMPLETION.peak.done}
                </>
              ) : (
                COMPLETION.peak.action
              )}
            </button>
            {visited && (
              <p className="mt-2 text-center font-body text-xs text-night-muted">
                Tap again to undo.
              </p>
            )}

            {fell.imageCredit && (
              <p className="mt-4 font-body text-xs sm:mt-6 text-night-muted">
                Photo: {fell.imageCredit}
              </p>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
