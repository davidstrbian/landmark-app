"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  COMPLETION,
  type Landmark,
  type LandmarkCategory,
} from "@/data/landmarks";
import { BIRD_LARGE, BIRD_SMALL, spruce } from "@/lib/shapes";

// OpenFreeMap's light "Positron" style: free, no API key, OpenStreetMap data
// (attribution comes with the style).
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

// Roughly centred on Finland, with the whole country in view.
const FINLAND_CENTER: [number, number] = [25.7, 65.2];
const FINLAND_BOUNDS: [[number, number], [number, number]] = [
  [19.0, 59.6],
  [31.6, 70.1],
];

// `filled` symbols get a thin outline in the same colour (in viewBox units)
// so fine shapes like the birds stay legible at marker size.
const svg = (viewBox: string, size: string, body: string, filled = 0) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" class="${size}" aria-hidden="true" ${
    filled
      ? `fill="currentColor" stroke="currentColor" stroke-width="${filled}" stroke-linejoin="round"`
      : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
  }>${body}</svg>`;

// One symbol per category, each taken from the home page: lucide's Mountain
// (the Fell nature type), the two birds of the wilderness cover and a spruce
// like those on the national park cover.
const ICONS: Record<LandmarkCategory, string> = {
  peak: svg("0 0 24 24", "size-[1.125rem]", '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>'),
  // At marker size the small bird would touch the large one's wing tip, so
  // it is moved further up and out than on the cover.
  "wilderness-area": svg(
    "112 40 236 94",
    "w-[1.75rem]",
    `<path d="${BIRD_LARGE}"/><path d="${BIRD_SMALL}" transform="translate(22 -16)"/>`,
    9,
  ),
  "national-park": svg(
    "0 0 24 24",
    "size-5",
    `<path d="${spruce(12, 22.5, 21)}"/>`,
    0.5,
  ),
};

// Every marker is white with a grey symbol until completed. Completed markers
// take their section's colours: night and dusk for fells, the wilderness
// cover's pale sky and tundra birds, and for parks a pale green spruce on
// forest green.
const MARKER_BASE =
  "flex size-9 cursor-pointer items-center justify-center rounded-full shadow-[0_4px_12px_rgb(20_24_28/0.3)] transition-colors duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night";
const MARKER_TODO = "bg-white text-[#5b646b] ring-1 ring-night/10";
const MARKER_DONE: Record<LandmarkCategory, string> = {
  peak: "bg-night text-dusk",
  "wilderness-area": "bg-[#b4c1c6] text-tundra ring-1 ring-tundra/15",
  "national-park": "bg-forest text-[#adc3b0]",
};

// A hovered (or keyboard-focused) marker and its edges, in pixels relative to
// the map container.
export type MarkerHover = {
  id: string;
  x: number; // horizontal centre
  top: number;
  bottom: number;
};

type Props = {
  landmarks: Landmark[];
  visited: Set<string>;
  onSelect: (id: string) => void;
  onHover: (hover: MarkerHover | null) => void;
};

// A full-size MapLibre map with a marker for each landmark that has
// coordinates. maplibre-gl needs the
// browser (WebGL, window), so it is imported inside the effect rather than at
// the top of the file.
export function LandmarkMap({
  landmarks,
  visited,
  onSelect,
  onHover,
}: Props) {
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

      for (const landmark of landmarks) {
        if (landmark.lat === undefined || landmark.lng === undefined) continue;
        const el = document.createElement("button");
        el.type = "button";
        el.innerHTML = ICONS[landmark.category];
        el.setAttribute("aria-haspopup", "dialog");
        styleMarker(el, landmark, visitedRef.current.has(landmark.id));
        el.addEventListener("click", () => {
          onHoverRef.current(null);
          onSelectRef.current(landmark.id);
        });
        const show = () => {
          const box = containerRef.current?.getBoundingClientRect();
          if (!box) return;
          const r = el.getBoundingClientRect();
          onHoverRef.current({
            id: landmark.id,
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
        markers.set(landmark.id, el);
        // MapLibre adds its positioning classes to the marker element, so the
        // button is wrapped and only the button's classes change.
        const wrapper = document.createElement("div");
        wrapper.append(el);
        new Marker({ element: wrapper })
          .setLngLat([landmark.lng, landmark.lat])
          .addTo(map);
      }
    });

    return () => {
      cancelled = true;
      markers.clear();
      map?.remove();
    };
  }, [landmarks]);

  // Recolour markers when a landmark is marked conquered or unmarked.
  useEffect(() => {
    for (const landmark of landmarks) {
      const el = markersRef.current.get(landmark.id);
      if (el) styleMarker(el, landmark, visited.has(landmark.id));
    }
  }, [landmarks, visited]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Map of Finland"
      className="size-full"
    />
  );
}

function styleMarker(el: HTMLElement, landmark: Landmark, done: boolean) {
  el.className = `${MARKER_BASE} ${done ? MARKER_DONE[landmark.category] : MARKER_TODO}`;
  el.setAttribute(
    "aria-label",
    `${landmark.name}${done ? `, ${COMPLETION[landmark.category].done.toLowerCase()}` : ""}. Open details`,
  );
}
