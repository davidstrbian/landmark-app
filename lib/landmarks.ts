import { landmarks, type Landmark } from "@/data/landmarks";

// Data access boundary: UI code calls this, never the data file directly.
// In V0.2 this becomes a Supabase query with the same return type.
export async function getLandmarks(): Promise<Landmark[]> {
  return landmarks;
}
