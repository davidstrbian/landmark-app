import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config";

// A cookie-less client for public data (landmarks). It never reads the
// visitor's session, so pages that use it stay static and cacheable. Returns
// null when the project isn't configured, so the app can fall back to the
// local data in data/landmarks.ts.
export function createPublicClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
