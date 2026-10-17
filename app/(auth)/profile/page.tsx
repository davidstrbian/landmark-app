import { Mountain, Sparkles, Trees } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { NotConfigured } from "@/components/auth/NotConfigured";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { COMPLETION, type LandmarkCategory } from "@/data/landmarks";
import { formatArea, formatElevation } from "@/lib/format";
import { getLandmarks } from "@/lib/landmarks";
import { CATEGORY_ICONS } from "@/lib/marker-icons";
import { PROFILE_COLUMNS, avatarUrl, memberSince, type Profile } from "@/lib/profile";
import { profileStats, type CompletionRow } from "@/lib/profile-stats";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Your profile · Landmark Tracker" };

// Each category's tile, in its home-page section colours.
const TILES: Record<LandmarkCategory, { label: string; short: string; tile: string; muted: string }> = {
  peak: { label: "Finnish Fells", short: "Fells", tile: "bg-night-sunken ring-1 ring-white/5", muted: "text-night-muted" },
  "wilderness-area": { label: "Wilderness Areas", short: "Wilderness", tile: "bg-tundra", muted: "text-tundra-muted" },
  "national-park": { label: "National Parks", short: "Parks", tile: "bg-forest", muted: "text-forest-muted" },
};
const MARKER_COLOURS: Record<LandmarkCategory, string> = {
  peak: "bg-night text-dusk",
  "wilderness-area": "bg-[#b4c1c6] text-tundra",
  "national-park": "bg-forest text-[#adc3b0]",
};

const dayMonthYear = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const percent = (done: number, total: number) => (total ? Math.round((done / total) * 100) : 0);

// One progress card: title and count on the left, the percentage in dusk
// on the right, a thin bar below (like the map's category progress card).
// Phones show the category tiles three across, so they get a short title, a
// plain "4 / 10" and no percentage; the full wording stays for screen readers.
function ProgressTile({
  title,
  short,
  done,
  total,
  verb,
  tile,
  muted,
  className = "",
}: {
  title: string;
  short?: string;
  done: number;
  total: number;
  verb: string;
  tile: string;
  muted: string;
  className?: string;
}) {
  const pct = percent(done, total);
  return (
    <div className={`rounded-2xl px-3.5 py-3 sm:px-4 ${tile} ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className={`font-heading font-medium ${short ? "text-sm sm:truncate sm:text-base" : "truncate"}`}>
            {short ? (
              <>
                <span aria-hidden="true" className="sm:hidden">{short}</span>
                <span className="sr-only sm:not-sr-only">{title}</span>
              </>
            ) : (
              title
            )}
          </p>
          <p className={`text-xs tabular-nums ${muted}`}>
            {short ? (
              <>
                <span aria-hidden="true" className="sm:hidden">{done} / {total}</span>
                <span className="sr-only sm:not-sr-only">{done} of {total} {verb}</span>
              </>
            ) : (
              `${done} of ${total} ${verb}`
            )}
          </p>
        </div>
        <p className={`shrink-0 font-heading text-2xl font-semibold tabular-nums text-dusk ${short ? "hidden sm:block" : ""}`}>
          {pct}
          <span className="text-sm">%</span>
        </p>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
        <div className="h-full rounded-full bg-dusk" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function ProfilePage() {
  if (!isSupabaseConfigured) return <NotConfigured />;
  const supabase = await createClient();
  // The proxy already sends signed-out visitors to log in; this is the second check.
  const { data: auth } = await supabase.auth.getClaims();
  const claims = auth?.claims;
  if (!claims) redirect("/login?next=/profile");

  const [{ data: profile }, { data: completions }, landmarks] = await Promise.all([
    supabase.from("profiles").select(PROFILE_COLUMNS).eq("id", claims.sub).maybeSingle<Profile>(),
    supabase.from("completions").select("landmark_id, completed_at").eq("user_id", claims.sub),
    getLandmarks(),
  ]);
  const stats = profileStats(landmarks, (completions ?? []) as CompletionRow[]);

  return (
    <div className="w-full max-w-5xl self-start font-body text-white">

      {/* Who: avatar, name, username, bio, member since; editable in place. */}
      <ProfileHeader
        userId={claims.sub}
        email={claims.email}
        displayName={profile?.display_name ?? ""}
        username={profile?.username ?? ""}
        bio={profile?.bio ?? ""}
        avatarUrl={avatarUrl(profile?.avatar_path)}
        memberSince={memberSince(profile?.created_at)}
      />

      {/* Progress: all landmarks across the top, then one tile per category,
          in the style of the map's category progress card. */}
      <section aria-labelledby="progress-heading" className="mt-6">
        <h2 id="progress-heading" className="sr-only">Progress</h2>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <ProgressTile
            className="col-span-3"
            title="All landmarks"
            done={stats.done}
            total={stats.total}
            verb="completed"
            tile="bg-night-raised"
            muted="text-night-muted"
          />
          {stats.categories.map((c) => {
            const t = TILES[c.category];
            return (
              <ProgressTile
                key={c.category}
                title={t.label}
                short={t.short}
                done={c.done}
                total={c.total}
                verb={COMPLETION[c.category].done.toLowerCase()}
                tile={t.tile}
                muted={t.muted}
              />
            );
          })}
        </div>
      </section>

      {/* Highlights. */}
      <section aria-labelledby="highlights-heading" className="mt-6">
        <h2 id="highlights-heading" className="font-heading text-lg font-semibold">Highlights</h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-2xl bg-night-raised p-4 sm:p-5">
            <dt className="flex items-center gap-2 text-sm text-night-muted">
              <Mountain className="size-4 text-dusk" aria-hidden="true" />
              Highest fell conquered
            </dt>
            <dd className="mt-1 font-heading text-xl font-semibold">
              {stats.highestFell ? (
                <>
                  {stats.highestFell.name}{" "}
                  <span className="text-base font-normal text-night-muted">
                    {formatElevation(stats.highestFell.elevationM ?? 0)}
                  </span>
                </>
              ) : (
                <span className="text-base font-normal text-night-muted">None yet</span>
              )}
            </dd>
          </div>
          <div className="rounded-2xl bg-night-raised p-4 sm:p-5">
            <dt className="flex items-center gap-2 text-sm text-night-muted">
              <Trees className="size-4 text-dusk" aria-hidden="true" />
              Protected area explored
            </dt>
            <dd className="mt-1 font-heading text-xl font-semibold tabular-nums">{formatArea(stats.areaKm2)}</dd>
          </div>
          <div className="rounded-2xl bg-night-raised p-4 sm:p-5">
            <dt className="flex items-center gap-2 text-sm text-night-muted">
              <Sparkles className="size-4 text-dusk" aria-hidden="true" />
              This year
            </dt>
            <dd className="mt-1 font-heading text-xl font-semibold tabular-nums">
              {stats.thisYear} {stats.thisYear === 1 ? "landmark" : "landmarks"}
            </dd>
          </div>
        </dl>
      </section>

      {/* Recent activity, newest first. */}
      <section aria-labelledby="activity-heading" className="mt-6 rounded-3xl bg-card p-5 text-foreground sm:p-8">
        <h2 id="activity-heading" className="font-heading text-lg font-semibold">Recent activity</h2>
        {stats.recent.length === 0 ? (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            No landmarks yet. Find one on the{" "}
            <Link href="/map" className="rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">map</Link>{" "}
            or browse the{" "}
            <Link href="/" className="rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">landmarks</Link>
            , then mark it {COMPLETION.peak.done.toLowerCase()} or {COMPLETION["national-park"].done.toLowerCase()}.
          </p>
        ) : (
          <ol className="mt-4 divide-y divide-border">
            {stats.recent.map(({ landmark, verb, completedAt }) => (
              <li key={landmark.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full ${MARKER_COLOURS[landmark.category]}`}
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[landmark.category] }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    <span className="text-muted">{verb} </span>
                    <span className="font-semibold">{landmark.name}</span>
                  </p>
                  <p className="truncate text-xs text-muted">{landmark.region}</p>
                </div>
                <time dateTime={completedAt} className="shrink-0 text-xs text-muted tabular-nums">
                  {dayMonthYear.format(new Date(completedAt))}
                </time>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
