"use client";

import { useState } from "react";
import { Check, Mountain } from "lucide-react";

type Peak = { name: string; elevation: number; region: string };

const peaks: Peak[] = [
  { name: "Halti", elevation: 1324, region: "Enontekiö, Lapland" },
  { name: "Sokosti", elevation: 718, region: "Urho Kekkonen National Park, Lapland" },
  { name: "Taivaskero", elevation: 807, region: "Pallas-Yllästunturi, Lapland" },
  { name: "Ukko-Koli", elevation: 347, region: "Koli, North Karelia" },
  { name: "Saana", elevation: 1029, region: "Kilpisjärvi, Lapland" },
];

const maxElevation = Math.max(...peaks.map((p) => p.elevation));

export default function PeakChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(peak: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(peak)) {
        next.delete(peak);
      } else {
        next.add(peak);
      }
      return next;
    });
  }

  const climbedMeters = peaks
    .filter((p) => checked.has(p.name))
    .reduce((sum, p) => sum + p.elevation, 0);
  const percent = (checked.size / peaks.length) * 100;
  const complete = checked.size === peaks.length;

  return (
    <section aria-labelledby="peaks-heading">
      <div className="mb-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="peaks-heading"
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted"
            >
              Five Iconic Finnish Peaks
            </h2>
            <p className="mt-3 font-serif text-4xl font-medium tabular-nums">
              {checked.size}
              <span className="text-muted"> / {peaks.length}</span>
              <span className="ml-3 font-sans text-base font-normal text-muted">
                climbed
              </span>
            </p>
          </div>
          <p className="text-right font-mono text-sm tabular-nums text-muted">
            <span className="text-foreground">
              {climbedMeters.toLocaleString("en-US")} m
            </span>{" "}
            of summit elevation
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Peaks climbed"
          aria-valuemin={0}
          aria-valuemax={peaks.length}
          aria-valuenow={checked.size}
          className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-border"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-4 min-h-5 text-sm text-accent" aria-live="polite">
          {complete ? "All five summits reached. Hyvin tehty!" : ""}
        </p>
      </div>

      <ul className="space-y-3">
        {peaks.map((peak) => {
          const isChecked = checked.has(peak.name);
          return (
            <li key={peak.name}>
              <button
                type="button"
                aria-pressed={isChecked}
                onClick={() => toggle(peak.name)}
                className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-5 sm:p-5 ${
                  isChecked
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isChecked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted group-hover:text-primary"
                  }`}
                >
                  {isChecked ? (
                    <Check className="size-5" strokeWidth={2.5} />
                  ) : (
                    <Mountain className="size-5" />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span
                      className={`font-serif text-2xl font-medium ${
                        isChecked ? "text-muted" : ""
                      }`}
                    >
                      {peak.name}
                    </span>
                    <span className="font-mono text-sm tabular-nums text-muted">
                      {peak.elevation.toLocaleString("en-US")} m
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-muted">
                    {peak.region}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-1 overflow-hidden rounded-full bg-border"
                  >
                    <span
                      className={`block h-full rounded-full transition-colors ${
                        isChecked ? "bg-primary" : "bg-muted/50"
                      }`}
                      style={{
                        width: `${(peak.elevation / maxElevation) * 100}%`,
                      }}
                    />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
