"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { COMPLETION, type Landmark } from "@/data/landmarks";

// OpenFreeMap's light "Positron" style: free, no API key, OpenStreetMap data
// (attribution comes with the style).
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

// Roughly centred on Finland, with the whole country in view.
const FINLAND_CENTER: [number, number] = [25.7, 65.2];
const FINLAND_BOUNDS: [[number, number], [number, number]] = [
  [19.0, 59.6],
  [31.6, 70.1],
];

// lucide's Mountain, the same symbol as the Fell nature type.
const FELL_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-[1.125rem]" aria-hidden="true"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>';

// Fell section palette: white with a grey fell until conquered, then night
// with a dusk fell.
const MARKER_BASE =
  "flex size-9 cursor-pointer items-center justify-center rounded-full shadow-[0_4px_12px_rgb(20_24_28/0.3)] transition-colors duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night";
const MARKER_TODO = "bg-white text-[#5b646b] ring-1 ring-night/10";
const MARKER_DONE = "bg-night text-dusk";

// A hovered (or keyboard-focused) marker and its edges, in pixels relative to
// the map container.
export type MarkerHover = {
  id: string;
  x: number; // horizontal centre
  top: number;
  bottom: number;
};

type Props = {
  fells: Landmark[];
  visited: Set<string>;
  onSelect: (id: string) => void;
  onHover: (hover: MarkerHover | null) => void;
};

// A full-size MapLibre map with a marker for each fell. maplibre-gl needs the
// browser (WebGL, window), so it is imported inside the effect rather than at
// the top of the file.
export function LandmarkMap({ fells, visited, onSelect, onHover }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef(new Map<string, HTMLButtonElement>());
  // Latest values for the map's event handlers, which are set up once.
  const onSelectRef = useRef(onSelect);
  const onHoverRef = useRef(onHover);
  const visitedRef = useRef(visited);
  useEffect(() => {
    onSelectRef.current = onSelect;
    onHoverRef.current = onHover;
    visitedRef.current = visited;
  });

  useEffect(() => {
    let map: import("maplibre-gl").Map | undefined;
    let cancelled = false;
    const markers = markersRef.current;

    import("maplibre-gl").then((maplibre) => {
      if (cancelled || !containerRef.current) return;
      const { Map, Marker, NavigationControl, ScaleControl } = maplibre;
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
      // A preview would drift away from its marker while the map moves.
      map.on("movestart", () => onHoverRef.current(null));

      for (const fell of fells) {
        if (fell.lat === undefined || fell.lng === undefined) continue;
        const el = document.createElement("button");
        el.type = "button";
        el.innerHTML = FELL_ICON;
        el.setAttribute("aria-haspopup", "dialog");
        styleMarker(el, fell, visitedRef.current.has(fell.id));
        el.addEventListener("click", () => {
          onHoverRef.current(null);
          onSelectRef.current(fell.id);
        });
        const show = () => {
          const box = containerRef.current?.getBoundingClientRect();
          if (!box) return;
          const r = el.getBoundingClientRect();
          onHoverRef.current({
            id: fell.id,
            x: r.left + r.width / 2 - box.left,
            top: r.top - box.top,
            bottom: r.bottom - box.top,
          });
        };
        const hide = () => onHoverRef.current(null);
        el.addEventListener("mouseenter", show);
        el.addEventListener("focus", show);
        el.addEventListener("mouseleave", hide);
        el.addEventListener("blur", hide);
        markers.set(fell.id, el);
        // MapLibre adds its positioning classes to the marker element, so the
        // button is wrapped and only the button's classes change.
        const wrapper = document.createElement("div");
        wrapper.append(el);
        new Marker({ element: wrapper })
          .setLngLat([fell.lng, fell.lat])
          .addTo(map);
      }
    });

    return () => {
      cancelled = true;
      markers.clear();
      map?.remove();
    };
  }, [fells]);

  // Recolour markers when a fell is marked conquered or unmarked.
  useEffect(() => {
    for (const fell of fells) {
      const el = markersRef.current.get(fell.id);
      if (el) styleMarker(el, fell, visited.has(fell.id));
    }
  }, [fells, visited]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Map of Finland"
      className="size-full"
    />
  );
}

function styleMarker(el: HTMLElement, fell: Landmark, done: boolean) {
  el.className = `${MARKER_BASE} ${done ? MARKER_DONE : MARKER_TODO}`;
  el.setAttribute(
    "aria-label",
    `${fell.name}${done ? `, ${COMPLETION.peak.done.toLowerCase()}` : ""}. Open details`,
  );
}
