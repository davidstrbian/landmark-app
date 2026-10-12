"use client";

import type { Landmark } from "@/data/landmarks";
import { useVisited } from "@/hooks/use-visited";
import { FellsSection } from "@/components/FellsSection";
import { LandmarkGrid } from "@/components/LandmarkGrid";
import { ProgressBar } from "@/components/ProgressBar";

// One useVisited instance shared by the fells, the progress bar and the grid,
// so toggling a landmark in either dialog updates the bar immediately.
export function Tracker({ landmarks }: { landmarks: Landmark[] }) {
  const { visited, ready, toggle } = useVisited();
  const fells = landmarks.filter((l) => l.category === "peak");
  const others = landmarks.filter((l) => l.category !== "peak");

  return (
    <>
      <FellsSection
        fells={fells}
        visited={visited}
        ready={ready}
        onToggleVisited={toggle}
      />

      <div className="mx-auto w-full max-w-6xl px-5 pt-6 sm:px-8 sm:pt-10">
        <section aria-label="Your progress" className="mt-10">
          <ProgressBar landmarks={landmarks} visited={visited} ready={ready} />
        </section>

        <section id="landmarks" aria-labelledby="landmarks-heading" className="mt-16">
          <h2
            id="landmarks-heading"
            className="mb-6 text-2xl font-semibold tracking-tight"
          >
            National Parks
          </h2>
          <LandmarkGrid
            landmarks={others}
            visited={visited}
            ready={ready}
            onToggleVisited={toggle}
          />
        </section>
      </div>
    </>
  );
}
