import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAnonKey, supabaseUrl } from "./config";

// A client for Server Components, Server Actions and Route Handlers that acts
// as the signed-in visitor, reading their session from cookies. Create one per
// request. Only call it when isSupabaseConfigured is true.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components can't set cookies. The proxy refreshes the
          // session on the routes that need it, so this is safe to ignore.
        }
      },
    },
  });
}
