# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Landmark Tracker: a small app for tracking peaks, trails and adventures. Next.js 16 (App Router) with React 19, TypeScript (strict) and Tailwind CSS v4.

## Commands

```bash
npm ci            # install dependencies (node_modules is needed for the Next docs referenced in AGENTS.md)
npm run dev       # dev server on http://localhost:3000
npm run build     # production build; also type-checks the project
npm run start     # serve the production build
npm run lint      # ESLint (flat config: next core-web-vitals + typescript)
```

There is no test framework set up yet, so `npm run lint` and `npm run build` are the checks to run before committing.

## Architecture

- Everything lives under `app/` (App Router). `app/layout.tsx` is the root layout: it loads Geist, Geist Mono and Fraunces via `next/font/google` as CSS variables, sets `metadata` and a `viewport` theme color for light and dark, and imports `app/globals.css`.
- Components are Server Components by default. Interactive UI goes in a separate file marked `"use client"` that a server page imports. For example, `app/page.tsx` (server, page header) renders `app/peak-checklist.tsx` (client, holds the ticked peaks in `useState`).
- There's no backend, database or persistence. The peak data (name, elevation, region) is a hardcoded array in `peak-checklist.tsx`, and ticked state is lost on reload.
- Icons come from `lucide-react`.
- Styling uses Tailwind v4, configured CSS-first, with no `tailwind.config` file. `globals.css` defines the palette as CSS variables on `:root` (`--background`, `--card`, `--muted`, `--border`, `--primary`, `--accent`, …) with a `prefers-color-scheme: dark` override. An `@theme inline` block exposes them as Tailwind colors (`bg-card`, `text-muted`, `border-border`, …) and fonts (`font-sans` = Geist, `font-mono` = Geist Mono, `font-serif` = Fraunces). Use these tokens rather than raw colors. `postcss.config.mjs` only enables `@tailwindcss/postcss`.
- The `@/*` import alias maps to the repo root (`tsconfig.json`).
- `LayoutProps<"/">` in `layout.tsx` is a globally generated Next.js route type helper, not an import.
