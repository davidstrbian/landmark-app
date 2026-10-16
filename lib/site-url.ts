import { headers } from "next/headers";

// This site's origin (e.g. https://example.com) for links in auth emails and
// the Google return address, so they come back to whichever deployment the
// visitor is on: localhost, a preview or production. Each must be listed under
// Authentication → URL Configuration → Redirect URLs in Supabase.
export async function siteOrigin(): Promise<string> {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) return `${h.get("x-forwarded-proto") ?? "https"}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
