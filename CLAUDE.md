# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Finland Landmark Tracker (V0.1): a single-page app for browsing Finland's fells, national parks and natural landmarks and marking them visited. Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, `lucide-react` icons. Deploy target is Vercel. There's no backend: visited state lives in `localStorage`. Supabase and auth are planned for V0.2.

Out of scope for V0.1: accounts, Supabase, map view, social features, other countries, user-submitted landmarks, i18n.

## Commands

```bash
npm ci              # install dependencies (node_modules is needed for the Next docs referenced in AGENTS.md)
npm run dev         # dev server on http://localhost:3000
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint (next core-web-vitals + typescript)
npm run build       # production build
```

There's no test framework. Before committing, run typecheck, lint and build, and check the page in a browser at mobile (390px) and desktop widths.

## Architecture

- **Data:** `data/landmarks.ts` holds the `Landmark` type and every entry: 8 fells (category `peak`, in display order) and 12 national parks. Fells carry extra optional fields (`relief`, `difficulty`, `hike`, `protectedArea`) plus `notes`, which are shown under each field in the fell dialog. Leave a field out when no reliable source exists; the dialog then shows it as "Not found" with a note for review. `lat`/`lng` are optional for the same reason. UI code never imports it directly. It goes through `lib/landmarks.ts` (`getLandmarks()`, async), which is the point where Supabase gets swapped in.
- **Visited state:** `lib/visited-store.ts` (`getVisited` / `setVisited` / `subscribe`) wraps `localStorage` key `landmarks.visited.v1`. Every storage access is in try/catch, and the store syncs across tabs. `hooks/use-visited.ts` reads it with `useSyncExternalStore`. The server snapshot is `null`, so `ready` is false during SSR and hydration and components show skeletons, not a mismatched state. Keep that shape when swapping the backend.
- **Page composition:** `app/page.tsx` (server) loads landmarks and renders `Header`, `Hero`, then `app/tracker.tsx` (client) inside `main`. `Hero` is a full-width 1585×685 banner (`aspect-[1585/685]`, with a `min-h-[26rem]` floor on narrow screens) showing `public/images/hero.jpg`, cropped with `object-cover`. The photo is loaded by static import so it gets an automatic blur placeholder, and has a dark overlay. Its heading stays on one line under the custom `wide:` variant (`@media (min-aspect-ratio: 3/2)`, defined in `globals.css`) and breaks after "Your" on narrower windows. Font sizes scale with `vw`. `Header` is absolutely positioned with white text so it sits on top of the hero. `Tracker` owns the single `useVisited()` instance. It renders the full-width `FellsSection` (fells only), then a `max-w-6xl` container with `ProgressBar` (all landmarks) and `LandmarkGrid` (everything except fells). That's why toggling in the dialog updates the bar immediately. The progress bar always shows overall progress and ignores filters.
- **Components:** `LandmarkGrid` owns the search query, the category filter and the selected landmark. Search ignores case and diacritics, so "yllas" finds "Ylläs". `FilterBar` only shows category chips when the list has more than one category. `LandmarkDialog` (light, parks) and `FellDialog` (dark, fells) both wrap `Modal`. `Modal` is a native `<dialog>` opened with `showModal()`, which provides the focus trap, Esc to close and focus return. A backdrop click is detected as `event.target === dialog`.
- **Images:** `LandmarkImage` renders `next/image` when `landmark.image` is set. With no photo, or if the photo fails to load, it shows a gradient placeholder themed by category. Photos should be licensed (e.g. Wikimedia Commons), self-hosted under `public/landmarks/`, and credited in `imageCredit`.

## Conventions

- **Facts:** landmark facts follow Metsähallitus (luontoon.fi, formerly nationalparks.fi) first, then Wikipedia/Wikidata. Don't guess numbers. Descriptions are original text of 2–4 sentences.
- **Styling:** Tailwind v4 is configured CSS-first in `app/globals.css`, with no tailwind config file. Colors are CSS variables exposed through `@theme inline` (`bg-background`, `bg-card`, `text-muted`, `bg-subtle`, `border-border`, `bg-primary`, `bg-primary-soft`, …), plus `shadow-soft` and `shadow-lift`. Use these tokens rather than raw colors. The Finnish Fells section has its own palette taken from the hero photo: `bg-mist` (#C2C8CC) with `text-mist-ink`, dark `bg-night` cards and `bg-night-raised` tiles, `text-night-muted`, and a warm `text-dusk` accent. Fell cards without a photo show a dusk-sky placeholder with ridge silhouettes, drawn in `LandmarkImage`. The rest of the page is light only: off-white `#FAFAF7`, a single spruce-green accent `#1F6F54`, 16–24px corners. Text colors are checked against WCAG AA.
- **Fonts:** new text uses Manrope for headings (`font-heading`) and Poppins for body copy (`font-body`), both loaded in `app/layout.tsx`. Older text still uses Geist (`font-sans`) until it's restyled.
- **Interaction:** every interactive element gets a visible `focus-visible:outline-primary` ring. Motion uses `motion-safe:`, and `globals.css` disables transitions under `prefers-reduced-motion`.
- **Next 16 APIs:** use `preload` on `next/image`, not the deprecated `priority`. `LayoutProps<"/">` is a globally generated route type, not an import.
- **Imports:** `@/*` maps to the repo root.
