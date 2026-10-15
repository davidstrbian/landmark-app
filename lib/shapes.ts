// Shapes shared by the card placeholders (LandmarkImage) and the map markers.

// The two soaring birds of the wilderness placeholder, in its 400×300 space:
// a large one, then a smaller one further away.
export const BIRD_LARGE =
  "M200 109c-16-16-40-28-80-24 32 4 52 16 68 32l12 8 12-8c16-16 36-28 68-32-40-4-64 8-80 24z";
export const BIRD_SMALL =
  "M286 74c-6-6-15-10-30-9 12 2 19 6 25 12l5 3 4-3c6-6 13-10 25-12-15-1-24 3-29 9z";

// A spruce silhouette: a trunk under four tiers that widen towards the
// ground. x is the centre, y the ground line, h the height.
export function spruce(x: number, y: number, h: number) {
  const w = h * 0.36; // half-width of the lowest tier
  const tiers = 4;
  let d = `M${x} ${y - h}`;
  const right: string[] = [];
  const left: string[] = [];
  for (let i = 1; i <= tiers; i++) {
    const ty = y - h + (h * 0.88 * i) / tiers;
    const tw = (w * i) / tiers;
    const inner = tw * 0.45;
    right.push(`L${x + tw} ${ty}L${x + inner} ${ty}`);
    left.unshift(`L${x - inner} ${ty}L${x - tw} ${ty}`);
  }
  // Drop the inner notch of the lowest tier so the trunk joins it.
  right[tiers - 1] = right[tiers - 1].replace(/L[^L]+$/, "");
  left[0] = left[0].replace(/^L[^L]+/, "");
  const trunk = h * 0.05;
  const base = y - h * 0.12;
  d += right.join("");
  d += `L${x + trunk} ${base}L${x + trunk} ${y}L${x - trunk} ${y}L${x - trunk} ${base}`;
  d += left.join("") + "Z";
  return d;
}
