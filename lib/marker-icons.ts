import type { LandmarkCategory } from "@/data/landmarks";
import { BIRD_LARGE, BIRD_SMALL, spruce } from "@/lib/shapes";

// SVG markup for each category's symbol, used by the map markers (plain DOM)
// and the map's category filter buttons. Colours come from currentColor.

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
export const CATEGORY_ICONS: Record<LandmarkCategory, string> = {
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
