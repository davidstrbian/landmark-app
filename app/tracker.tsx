"use client";

import type { Landmark } from "@/data/landmarks";
import { useVisited } from "@/hooks/use-visited";
import { FellsSection } from "@/components/FellsSection";
import { LandmarkGrid } from "@/components/LandmarkGrid";
import { ProgressBar } from "@/components/ProgressBar";
import { WildernessSection } from "@/components/WildernessSection";

// One useVisited instance shared by the fells, the progress bar and the grid,
// so toggling a landmark in either dialog updates the bar immediately.
export function Tracker({ landmarks }: { landmarks: Landmark[] }) {
  const { visited, ready, toggle } = useVisited();
  const fells = landmarks.filter((l) => l.category === "peak");
  const wilderness = landmarks.filter((l) => l.category === "wilderness-area");
  const parks = landmarks.filter((l) => l.category === "national-park");

  return (
    <>
      <FellsSection
        fells={fells}
        visited={visited}
        ready={ready}
        onToggleVisited={toggle}
      />

      <WildernessSection
        areas={wilderness}
        visited={visited}
        ready={ready}
        onToggleVisited={toggle}
      />

      {/* National Parks, on the page's off-white background. */}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <section aria-label="Your progress">
          <ProgressBar landmarks={landmarks} visited={visited} ready={ready} />
        </section>

        <section
          id="landmarks"
          aria-labelledby="landmarks-heading"
          className="mt-16"
        >
          <h2
            id="landmarks-heading"
            className="mb-6 text-2xl font-semibold tracking-tight"
          >
            National Parks
          </h2>
          <LandmarkGrid
            landmarks={parks}
            visited={visited}
            ready={ready}
            onToggleVisited={toggle}
          />
        </section>
      </div>
    </>
  );
}
