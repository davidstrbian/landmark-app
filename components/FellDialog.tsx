"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { COMPLETION, type FellField, type Landmark } from "@/data/landmarks";
import { formatElevation } from "@/lib/format";
import { LandmarkImage } from "./LandmarkImage";
import { Modal } from "./Modal";

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

// A fact tile. A missing value is shown as such, so gaps in the data are
// visible and can be filled in later.
function Fact({
  label,
  note,
  wide,
  children,
}: {
  label: string;
  note?: string;
  wide?: boolean;
  children?: ReactNode;
}) {
  // Callers pass `cond && <el />`, so a missing value arrives as false.
  const missing = children == null || children === false;
  return (
    <div
      className={`rounded-2xl bg-night-raised p-4 ${wide ? "sm:col-span-2" : ""}`}
    >
      <dt className="font-body text-xs font-medium uppercase tracking-wide text-night-muted">
        {label}
      </dt>
      <dd className="mt-1 font-body text-white">
        {missing ? (
          <span className="text-night-muted">Not found</span>
        ) : (
          children
        )}
      </dd>
      {(missing || note) && (
        <p className="mt-2 font-body text-xs leading-relaxed text-dusk">
          {note ?? "No reliable source found yet. Needs to be added."}
        </p>
      )}
    </div>
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
            sizes="(min-width: 640px) 576px, 100vw"
            className="aspect-[16/9] w-full shrink-0"
          />

          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-body text-sm text-dusk">{fell.region}</p>
                <h2
                  id="fell-dialog-title"
                  className="mt-1 font-heading text-3xl font-semibold tracking-tight"
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
            <p className="mt-4 font-body leading-relaxed text-night-muted">
              {fell.description}
            </p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              <Fact label="Coordinates" note={note("coordinates")}>
                {fell.lat !== undefined && fell.lng !== undefined && (
                  <CopyCoordinates
                    key={fell.id}
                    lat={fell.lat}
                    lng={fell.lng}
                  />
                )}
              </Fact>
              <Fact label="Difficulty" note={note("difficulty")}>
                {fell.difficulty}
              </Fact>
              <Fact label="Typical hike" note={note("hike")} wide>
                {fell.hike && (
                  <>
                    {fell.hike.name && (
                      <span className="block font-medium">
                        {fell.hike.name}
                      </span>
                    )}
                    <span className="block tabular-nums">
                      {[fell.hike.distance, fell.hike.duration]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                    <span className="block text-sm text-night-muted">
                      From {fell.hike.trailhead}
                    </span>
                  </>
                )}
              </Fact>
            </dl>

            <button
              type="button"
              onClick={() => onToggleVisited(fell.id)}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-body font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk ${
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
              <p className="mt-6 font-body text-xs text-night-muted">
                Photo: {fell.imageCredit}
              </p>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
