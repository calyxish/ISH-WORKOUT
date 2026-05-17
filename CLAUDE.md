# ISH Workout — Claude project notes

@AGENTS.md

## What this is

A personal, responsive **life-management PWA**. Tracks four things:

1. **Weight** — quick entry, target setting, history list, graph with range filters (1H / 24H / 7D / 30D / 1Y / All / Custom).
2. **Daily todos** — one list per day, auto-rolls at local midnight, history kept.
3. **Meal times** — log when you eat, daily timeline.
4. **Water intake** — cup counter against a daily goal, resets at midnight.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind v4 — theme tokens come from CSS variables in `src/app/globals.css` (mapped via `@theme inline`).
- **Storage:** `localStorage` only (no backend, no auth). Wrapped in `src/lib/storage` so a cloud swap is a one-file change.
- **PWA:** Native Next.js manifest at `src/app/manifest.ts` + hand-rolled service worker at `public/sw.js`. Registered client-side in production only.
- **Deployment:** Vercel.

## Folder layout

```
src/
  app/
    layout.tsx                root layout, theme script, PWA meta
    globals.css               CSS-variable theme + Tailwind config
    manifest.ts               PWA manifest (Next.js file convention)
    icon.svg                  browser/favicon
    apple-icon.png            iOS home-screen icon (generated)
    (shell)/                  route group with sidebar/bottom-nav shell
      layout.tsx
      page.tsx                dashboard
      weight/page.tsx
      todos/page.tsx
      meals/page.tsx
      water/page.tsx
      settings/page.tsx
  components/
    brand/Logo.tsx            Mark + Logo lockup
    theme/                    ThemeScript (no-flash) + ThemeToggle
    pwa/                      ServiceWorkerRegister
    shell/                    Sidebar / MobileTopBar / BottomNav + nav-items
    ui/                       Card, PageHeader (more added in later phases)
  lib/                        storage + utilities (added in Phase 2)
  types/                      shared TS types (added in Phase 2)
public/
  sw.js                       service worker
  icons/                      generated PWA icons (192, 512, maskable)
scripts/
  generate-icons.mjs          one-off SVG → PNG icon generator (sharp)
```

## Theme tokens

Use the Tailwind utilities mapped from CSS variables:

- Backgrounds: `bg-bg-primary`, `bg-bg-surface`, `bg-bg-input`
- Border: `border-border-default`
- Accent: `bg-accent`, `text-accent`, `hover:bg-accent-hover`
- Semantic: `text-danger`, `text-success`
- Text: `text-text-primary`, `text-text-muted`

Dark mode is driven by `[data-theme="dark"]` on `<html>`. The `dark:` variant is wired via `@custom-variant dark (...)` in `globals.css`. The `ThemeScript` sets the attribute synchronously to avoid FOUC.

## Conventions

- Default to **server components**; use `"use client"` only where needed (state, effects, browser APIs).
- All `localStorage` access lives behind `src/lib/storage/*` — never read/write the key directly from a component.
- All "today/this week/this month" calculations are **read-time** (derived from `new Date()`). Nothing is scheduled to run at midnight.
- Brand icon = `<Mark />`. Full lockup = `<Logo />`. Don't reach for emojis.

## Phase tracker

See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for the phased build and version-control plan. Each phase must leave the app in a working state (verifiable in browser) before moving to the next.

## Regenerating icons

If the brand mark changes, edit `scripts/generate-icons.mjs` and run:

```bash
npm run icons
```

This regenerates `public/icons/{icon-192,icon-512,maskable-512}.png` and `src/app/apple-icon.png` from the in-script SVG definition.
