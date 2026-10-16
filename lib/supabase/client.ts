import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./config";

// A client for client components. It keeps the session in cookies shared with
// the server and refreshes it on its own. createBrowserClient returns the same
// instance on every call. Only call it when isSupabaseConfigured is true.
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
