import type { Landmark } from "@/data/landmarks";

const number = new Intl.NumberFormat("en-US");

export function formatElevation(m: number) {
  return `${number.format(m)} m`;
}

export function formatArea(km2: number) {
  return `${number.format(km2)} km²`;
}

// The single most useful fact for a card: elevation for peaks, area for parks.
export function keyFact(landmark: Landmark): string | undefined {
  if (landmark.elevationM !== undefined) {
    return formatElevation(landmark.elevationM);
  }
  if (landmark.areaKm2 !== undefined) return formatArea(landmark.areaKm2);
  return undefined;
}
