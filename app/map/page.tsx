import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { MapView } from "@/components/MapView";
import { getLandmarks } from "@/lib/landmarks";

export const metadata: Metadata = {
  title: "Map · Landmark Tracker",
  description: "A map of Finland's fells, wilderness areas and national parks.",
};

// The map fills the window below the header. The header's white text sits
// on a night-coloured band, as it does over the hero on the home page.
export default async function MapPage() {
  const landmarks = await getLandmarks();

  return (
    <div className="flex h-dvh flex-col bg-night">
      <Header />
      <div aria-hidden="true" className="h-20 shrink-0" />
      <main className="min-h-0 flex-1">
        <MapView landmarks={landmarks} />
      </main>
    </div>
  );
}
