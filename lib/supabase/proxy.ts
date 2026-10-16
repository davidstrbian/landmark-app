import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config";

// Pages only signed-in visitors may see, and pages signed-in visitors skip.
const PROTECTED = ["/account", "/reset-password"];
const GUEST_ONLY = ["/login", "/signup"];

const matches = (path: string, prefixes: string[]) =>
  prefixes.some((p) => path === p || path.startsWith(`${p}/`));

// Refreshes the visitor's session cookies and guards protected pages. Runs in
// proxy.ts on the auth routes only, so the public pages stay static.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // No-cache headers, so a CDN never serves one visitor's session to another.
        for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
      },
    },
  });

  // Must come first: it refreshes an expired session before anything else
  // reads it. getClaims verifies the token, so it is safe to trust.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const path = request.nextUrl.pathname;

  const redirectTo = (pathname: string, params: Record<string, string> = {}) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = new URLSearchParams(params).toString();
    const redirect = NextResponse.redirect(url);
    // Keep any refreshed session cookies and the no-cache headers.
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    response.headers.forEach((value, key) => {
      if (/^(cache-control|expires|pragma)$/i.test(key)) redirect.headers.set(key, value);
    });
    return redirect;
  };

  if (!signedIn && matches(path, PROTECTED)) {
    return redirectTo("/login", { next: path + request.nextUrl.search });
  }
  if (signedIn && matches(path, GUEST_ONLY)) return redirectTo("/account");
  return response;
}
