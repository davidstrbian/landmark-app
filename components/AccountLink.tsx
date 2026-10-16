"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/profile/Avatar";
import { avatarUrl, initialOf, type Profile } from "@/lib/profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

type Viewer =
  | { signedIn: false }
  | { signedIn: true; email?: string; profile: Pick<Profile, "display_name" | "username" | "avatar_path"> | null };

const AVATAR_PX = 36;

// "Log in", or the signed-in visitor's avatar linking to their profile. It
// asks the browser's Supabase client rather than the server, so the pages
// around it can stay static.
export function AccountLink() {
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    let active = true;

    async function load() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) {
        if (active) setViewer({ signedIn: false });
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username, avatar_path")
        .eq("id", user.id)
        .maybeSingle();
      if (active) setViewer({ signedIn: true, email: user.email, profile });
    }

    // Signing in and out happens on the server, which then navigates within
    // the app without remounting the header, so this reruns on every
    // navigation; on auth events in this tab; and when the profile changes.
    void load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      setTimeout(() => void load(), 0);
    });
    window.addEventListener("profile-updated", load);
    return () => {
      active = false;
      sub.subscription.unsubscribe();
      window.removeEventListener("profile-updated", load);
    };
  }, [pathname]);

  if (!isSupabaseConfigured) return null;
  const text =
    "rounded-lg font-body text-base font-medium text-white/90 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
  // Until the session is known, hold the space so the header doesn't shift.
  if (viewer === null)
    return <span aria-hidden="true" className="inline-block rounded-full" style={{ width: AVATAR_PX, height: AVATAR_PX }} />;
  if (!viewer.signedIn)
    return (
      <Link href="/login" className={text}>
        Log in
      </Link>
    );
  return (
    <Link
      href="/profile"
      aria-label="Your profile"
      className="rounded-full transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      <Avatar
        url={avatarUrl(viewer.profile?.avatar_path)}
        initial={initialOf(viewer.profile, viewer.email)}
        size={AVATAR_PX}
        className="ring-2 ring-white/70"
      />
    </Link>
  );
}
