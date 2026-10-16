import type { Landmark, LandmarkCategory } from "../data/landmarks";

// One row of the Supabase `landmarks` table (see supabase/migrations). Fields
// every landmark has get their own column; everything category-specific
// (a fell's hike, a park's nature types, a wilderness area's score, notes, …)
// lives in the `details` JSON column.
export type LandmarkRow = {
  id: string;
  name: string;
  category: LandmarkCategory;
  region: string;
  description: string;
  lat: number | null;
  lng: number | null;
  elevation_m: number | null;
  area_km2: number | null;
  image: string;
  image_credit: string | null;
  sort_order: number;
  details: Record<string, unknown>;
};

// Landmark keys stored in their own columns; any other key goes to `details`,
// so new optional fields need no migration.
const COLUMN_KEYS = new Set<keyof Landmark>([
  "id",
  "name",
  "category",
  "region",
  "description",
  "lat",
  "lng",
  "elevationM",
  "areaKm2",
  "image",
  "imageCredit",
]);

// Used by the seed script. `sortOrder` keeps the order of data/landmarks.ts
// (which is the site owner's order for the parks).
export function landmarkToRow(landmark: Landmark, sortOrder: number): LandmarkRow {
  const details: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(landmark)) {
    if (!COLUMN_KEYS.has(key as keyof Landmark) && value !== undefined) {
      details[key] = value;
    }
  }
  return {
    id: landmark.id,
    name: landmark.name,
    category: landmark.category,
    region: landmark.region,
    description: landmark.description,
    lat: landmark.lat ?? null,
    lng: landmark.lng ?? null,
    elevation_m: landmark.elevationM ?? null,
    area_km2: landmark.areaKm2 ?? null,
    image: landmark.image,
    image_credit: landmark.imageCredit ?? null,
    sort_order: sortOrder,
    details,
  };
}

// The inverse, used when loading from Supabase. Empty columns are left out
// (rather than set to undefined), so the result matches data/landmarks.ts.
export function rowToLandmark(row: LandmarkRow): Landmark {
  const landmark: Record<string, unknown> = {
    ...row.details,
    id: row.id,
    name: row.name,
    category: row.category,
    region: row.region,
    description: row.description,
    image: row.image,
  };
  const optional: [keyof Landmark, unknown][] = [
    ["lat", row.lat],
    ["lng", row.lng],
    ["elevationM", row.elevation_m],
    // Postgres numeric can arrive as a string; the app expects a number.
    ["areaKm2", row.area_km2 === null ? null : Number(row.area_km2)],
    ["imageCredit", row.image_credit],
  ];
  for (const [key, value] of optional) {
    if (value !== null && value !== undefined) landmark[key] = value;
  }
  return landmark as Landmark;
}
