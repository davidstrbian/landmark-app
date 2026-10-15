import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { LandmarkMap } from "@/components/LandmarkMap";

export const metadata: Metadata = {
  title: "Map · Landmark Tracker",
  description: "A map of Finland's fells, wilderness areas and national parks.",
};

// The map fills the window below the header. The header's white text sits
// on a night-coloured band, as it does over the hero on the home page.
export default function MapPage() {
  return (
    <div className="flex h-dvh flex-col bg-night">
      <Header />
      <div aria-hidden="true" className="h-20 shrink-0" />
      <main className="min-h-0 flex-1">
        <LandmarkMap />
      </main>
    </div>
  );
}
