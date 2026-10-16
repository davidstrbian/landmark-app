import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/safe-next";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

// Where the links in confirmation and password-reset emails land. Verifying
// the token signs the visitor in, so the link works in any browser, not only
// the one that asked for it.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const fallback = type === "recovery" ? "/reset-password" : "/profile";
  // The "Confirm signup" template from V03.2 still says next=/account; new
  // accounts now start on their profile instead.
  const requested = searchParams.get("next");
  const next = safeNext(type !== "recovery" && requested === "/account" ? "/profile" : requested, fallback);

  if (isSupabaseConfigured && tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }
  return NextResponse.redirect(new URL("/login?error=link", request.url));
}
