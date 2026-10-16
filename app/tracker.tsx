"use client";

import type { Landmark } from "@/data/landmarks";
import { useVisited } from "@/hooks/use-visited";
import { FellsSection } from "@/components/FellsSection";
import { LandmarkGrid } from "@/components/LandmarkGrid";
import { ProgressBar } from "@/components/ProgressBar";
import { SyncNotice } from "@/components/SyncNotice";
import { WildernessSection } from "@/components/WildernessSection";

// One useVisited instance shared by the progress bars and every section, so
// toggling a landmark in any dialog updates the bars immediately.
export function Tracker({ landmarks }: { landmarks: Landmark[] }) {
  const { visited, ready, toggle } = useVisited();
  const fells = landmarks.filter((l) => l.category === "peak");
  const wilderness = landmarks.filter((l) => l.category === "wilderness-area");
  const parks = landmarks.filter((l) => l.category === "national-park");

  return (
    <>
      {/* Overall progress, straight under the hero in its night tones. It
          fades into the Finnish Fells grey at its bottom edge. */}
      <section
        aria-labelledby="progress-heading"
        className="bg-night-fade pb-32 pt-10 sm:pb-36 sm:pt-14"
      >
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <ProgressBar landmarks={landmarks} visited={visited} ready={ready} />
        </div>
      </section>

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

      {/* National Parks on the page's off-white background. */}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <section id="landmarks" aria-labelledby="landmarks-heading">
          <h2
            id="landmarks-heading"
            className="font-heading text-[clamp(1.5rem,2.35vw,2.75rem)] font-medium leading-tight tracking-tight"
          >
            National Parks
          </h2>
          <p className="mt-3 font-heading text-lg font-medium sm:text-xl">
            Finland has 41 national parks, from the Archipelago Sea to the fells
            of Lapland.
          </p>
          <p className="mb-10 mt-3 max-w-3xl font-body leading-relaxed text-muted">
            Together they protect more than 10,000 km² of forests, lakes, mires
            and islands. National parks exist to preserve Finnish nature and to
            let everyone experience it. Marked trails, campfire sites and huts
            make them easy places to start. Entry is free.
          </p>
          <LandmarkGrid
            landmarks={parks}
            visited={visited}
            ready={ready}
            onToggleVisited={toggle}
          />
        </section>
      </div>

      <SyncNotice />
    </>
  );
}
