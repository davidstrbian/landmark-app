// Where to send someone after signing in, taken from a ?next= parameter.
// Only paths on this site are allowed: "//evil.com" and "/\evil.com" would be
// read by browsers as another site, so they fall back too.
export function safeNext(value: unknown, fallback = "/profile"): string {
  if (typeof value !== "string" || !value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
