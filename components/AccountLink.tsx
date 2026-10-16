"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

// "Log in" or "Account" in the header. It asks the browser's Supabase client
// rather than the server, so the pages around it can stay static.
export function AccountLink() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    // Fires straight away with the current session (INITIAL_SESSION), then on
    // every sign-in and sign-out, in this tab or another.
    const { data } = createClient().auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // Signing in and out happens on the server, which then navigates within the
  // app without remounting the header. Re-read the session cookies on every
  // navigation so the link catches up.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    createClient()
      .auth.getSession()
      .then(({ data }) => {
        if (active) setSignedIn(Boolean(data.session));
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  if (!isSupabaseConfigured) return null;
  const className =
    "rounded-lg font-body text-base font-medium text-white/90 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
  // Until the session is known, hold the space so the header doesn't shift.
  if (signedIn === null)
    return (
      <span aria-hidden="true" className={`${className} invisible`}>
        Log in
      </span>
    );
  return signedIn ? (
    <Link href="/account" className={className}>
      Account
    </Link>
  ) : (
    <Link href="/login" className={className}>
      Log in
    </Link>
  );
}
