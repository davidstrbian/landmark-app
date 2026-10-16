import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// A Supabase client for server components, using the public anon key (Row
// Level Security decides what it may read). It keeps no session: there are
// no sign-ins yet. Returns null when the project isn't configured, so the app
// can fall back to the local data in data/landmarks.ts.
export function createServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
