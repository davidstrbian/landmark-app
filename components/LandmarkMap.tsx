"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  COMPLETION,
  type Landmark,
  type LandmarkCategory,
} from "@/data/landmarks";
import { CATEGORY_ICONS } from "@/lib/marker-icons";

// OpenFreeMap's light "Positron" style: free, no API key, OpenStreetMap data
// (attribution comes with the style).
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

// Roughly centred on Finland, with the whole country in view.
const FINLAND_CENTER: [number, number] = [25.7, 65.2];
const FINLAND_BOUNDS: [[number, number], [number, number]] = [
  [19.0, 59.6],
  [31.6, 70.1],
];

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

// Ask the map to zoom to these landmarks. A new object (even with the same
// ids) triggers a new zoom.
export type FitRequest = { ids: string[] };

type Props = {
  landmarks: Landmark[];
  visible: Set<string>; // ids whose markers are shown (search and filter)
  visited: Set<string>;
  fitRequest: FitRequest | null;
  onSelect: (id: string) => void;
  onHover: (hover: MarkerHover | null) => void;
  // Touch screens (no hover): a tap previews the marker instead of opening it.
  onTap: (hover: MarkerHover) => void;
  onDismiss: () => void; // tap on the map, or the map moved
};

// A full-size MapLibre map with a marker for each landmark that has
// coordinates. maplibre-gl needs the
// browser (WebGL, window), so it is imported inside the effect rather than at
// the top of the file.
export function LandmarkMap({
  landmarks,
  visible,
  visited,
  fitRequest,
  onSelect,
  onHover,
  onTap,
  onDismiss,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const markersRef = useRef(new Map<string, HTMLButtonElement>());
  // Latest values for the map's event handlers, which are set up once.
  const onSelectRef = useRef(onSelect);
  const onHoverRef = useRef(onHover);
  const onTapRef = useRef(onTap);
  const onDismissRef = useRef(onDismiss);
  const visitedRef = useRef(visited);
  const visibleRef = useRef(visible);
  useEffect(() => {
    onSelectRef.current = onSelect;
    onHoverRef.current = onHover;
    onTapRef.current = onTap;
    onDismissRef.current = onDismiss;
    visitedRef.current = visited;
    visibleRef.current = visible;
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
      mapRef.current = map;
      map.addControl(new NavigationControl(), "top-right");
      map.addControl(new ScaleControl({ unit: "metric" }), "bottom-left");
      // A preview would drift away from its marker while the map moves.
      map.on("movestart", () => onDismissRef.current());
      // A tap on the map itself (not on a marker) closes a tapped preview.
      map.on("click", (event) => {
        const target = event.originalEvent.target;
        if (target instanceof Element && target.closest(".maplibregl-marker"))
          return;
        onDismissRef.current();
      });

      for (const landmark of landmarks) {
        if (landmark.lat === undefined || landmark.lng === undefined) continue;
        const el = document.createElement("button");
        el.type = "button";
        el.innerHTML = CATEGORY_ICONS[landmark.category];
        el.setAttribute("aria-haspopup", "dialog");
        // The marker's edges relative to the map, for placing its preview.
        const where = (): MarkerHover | null => {
          const box = containerRef.current?.getBoundingClientRect();
          if (!box) return null;
          const r = el.getBoundingClientRect();
          return {
            id: landmark.id,
            x: r.left + r.width / 2 - box.left,
            top: r.top - box.top,
            bottom: r.bottom - box.top,
          };
        };
        el.addEventListener("click", () => {
          // Touch screens have no hover, so the first tap shows the preview;
          // tapping the preview opens the dialog.
          const spot = where();
          if (window.matchMedia("(hover: none)").matches && spot) {
            onTapRef.current(spot);
            return;
          }
          onHoverRef.current(null);
          onSelectRef.current(landmark.id);
        });
        const show = () => {
          const spot = where();
          if (spot) onHoverRef.current(spot);
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
        styleMarker(el, landmark, visitedRef.current.has(landmark.id));
        setMarkerHidden(el, !visibleRef.current.has(landmark.id));
        new Marker({ element: wrapper })
          .setLngLat([landmark.lng, landmark.lat])
          .addTo(map);
      }
    });

    return () => {
      cancelled = true;
      markers.clear();
      mapRef.current = null;
      map?.remove();
    };
  }, [landmarks]);

  // Show only the markers that match the search and category filter.
  useEffect(() => {
    for (const [id, el] of markersRef.current) {
      setMarkerHidden(el, !visible.has(id));
    }
  }, [visible]);

  // Zoom to the requested landmarks: close in on a single one, or fit them
  // all in view.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !fitRequest) return;
    const points = landmarks
      .filter((l) => fitRequest.ids.includes(l.id))
      .flatMap((l) =>
        l.lat !== undefined && l.lng !== undefined
          ? [[l.lng, l.lat] as [number, number]]
          : [],
      );
    if (points.length === 0) return;
    if (points.length === 1) {
      map.flyTo({ center: points[0], zoom: Math.max(map.getZoom(), 8) });
      return;
    }
    const lngs = points.map((p) => p[0]);
    const lats = points.map((p) => p[1]);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 80, maxZoom: 9 },
    );
  }, [fitRequest, landmarks]);

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
  // Stacking order where markers overlap (on the wrapper MapLibre positions).
  el.parentElement?.style.setProperty(
    "z-index",
    String(stackLevel(landmark, done)),
  );
  el.className = `${MARKER_BASE} ${done ? MARKER_DONE[landmark.category] : MARKER_TODO}`;
  el.setAttribute(
    "aria-label",
    `${landmark.name}${done ? `, ${COMPLETION[landmark.category].done.toLowerCase()}` : ""}. Open details`,
  );
}

// Where markers overlap, completed ones sit on top. Within the completed
// and the not-yet-completed groups, national parks sit above wilderness
// areas, which sit above fells.
const CATEGORY_STACK: Record<LandmarkCategory, number> = {
  peak: 1,
  "wilderness-area": 2,
  "national-park": 3,
};
function stackLevel(landmark: Landmark, done: boolean) {
  return (done ? 3 : 0) + CATEGORY_STACK[landmark.category];
}

// Hides the marker's wrapper (the element MapLibre positions).
function setMarkerHidden(el: HTMLElement, hidden: boolean) {
  el.parentElement?.toggleAttribute("hidden", hidden);
}
