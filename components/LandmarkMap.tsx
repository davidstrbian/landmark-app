"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

// OpenFreeMap's light "Positron" style: free, no API key, OpenStreetMap data
// (attribution comes with the style).
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

// Roughly centred on Finland, with the whole country in view.
const FINLAND_CENTER: [number, number] = [25.7, 65.2];
const FINLAND_BOUNDS: [[number, number], [number, number]] = [
  [19.0, 59.6],
  [31.6, 70.1],
];

// A full-size MapLibre map. maplibre-gl needs the browser (WebGL, window), so
// it is imported inside the effect rather than at the top of the file.
export function LandmarkMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("maplibre-gl").Map | undefined;
    let cancelled = false;

    import("maplibre-gl").then((maplibre) => {
      if (cancelled || !containerRef.current) return;
      const { Map, NavigationControl, ScaleControl } = maplibre;
      // MapLibre looks for its worker next to its own file, which the bundler
      // moves; point it at the worker file explicitly so it gets bundled too.
      maplibre.setWorkerUrl(
        new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url)
          .href,
      );
      map = new Map({
        container: containerRef.current,
        style: STYLE_URL,
        center: FINLAND_CENTER,
        zoom: 4,
      });
      map.fitBounds(FINLAND_BOUNDS, { padding: 24, animate: false });
      map.addControl(new NavigationControl(), "top-right");
      map.addControl(new ScaleControl({ unit: "metric" }), "bottom-left");
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Map of Finland"
      className="size-full"
    />
  );
}
