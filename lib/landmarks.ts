import { landmarks as localLandmarks, type Landmark } from "@/data/landmarks";
import { rowToLandmark, type LandmarkRow } from "@/lib/landmark-row";
import { createServerClient } from "@/lib/supabase/server";

// Data access boundary: UI code calls this, never the data file or Supabase
// directly. With NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
// set, landmarks come from the Supabase `landmarks` table; without them (local
// development, CI) they come from data/landmarks.ts, which is also what
// supabase/seed.sql is generated from.
export async function getLandmarks(): Promise<Landmark[]> {
  const supabase = createServerClient();
  if (!supabase) return localLandmarks;

  const { data, error } = await supabase
    .from("landmarks")
    .select("*")
    .order("sort_order");
  // Fail loudly (the build or request errors) rather than show stale data.
  if (error) throw new Error(`Loading landmarks from Supabase failed: ${error.message}`);
  if (!data || data.length === 0)
    throw new Error("The Supabase landmarks table is empty: run supabase/seed.sql.");
  return (data as LandmarkRow[]).map(rowToLandmark);
}
