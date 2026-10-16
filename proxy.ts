import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  // An email link that landed on the home page: Supabase uses the Site URL
  // when the link's own address isn't in its Redirect URLs list. Send it on to
  // the route that signs the visitor in.
  if (request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/confirm";
    return NextResponse.redirect(url);
  }
  return updateSession(request);
}

// Only the routes that read the session, plus the home page when it carries
// an email-link token. Home and the map otherwise stay static and never set
// cookies; the browser client keeps the session fresh there.
export const config = {
  matcher: [
    "/profile/:path*",
    "/account/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/auth/:path*",
    { source: "/", has: [{ type: "query", key: "token_hash" }] },
  ],
};
