"use client";

import type { Landmark } from "@/data/landmarks";
import { useVisited } from "@/hooks/use-visited";
import { LandmarkGrid } from "@/components/LandmarkGrid";
import { ProgressBar } from "@/components/ProgressBar";

// One useVisited instance shared by the progress bar and the grid, so
// toggling a landmark in the dialog updates the bar immediately.
export function Tracker({ landmarks }: { landmarks: Landmark[] }) {
  const { visited, ready, toggle } = useVisited();

  return (
    <>
      <section aria-label="Your progress" className="mt-10">
        <ProgressBar landmarks={landmarks} visited={visited} ready={ready} />
      </section>

      <section id="landmarks" aria-labelledby="landmarks-heading" className="mt-16">
        <h2
          id="landmarks-heading"
          className="mb-6 text-2xl font-semibold tracking-tight"
        >
          Landmarks
        </h2>
        <LandmarkGrid
          landmarks={landmarks}
          visited={visited}
          ready={ready}
          onToggleVisited={toggle}
        />
      </section>
    </>
  );
}
