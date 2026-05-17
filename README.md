# ISH Workout

A personal life-management PWA — track **weight**, **daily todos**, **meal times**, and **water intake** on one responsive screen.

Built with Next.js 16, React 19, TypeScript, and Tailwind v4. Installable to your phone home screen as a PWA. All data lives in your browser via `localStorage` — no backend, no accounts.

## Features

- **Weight** — quick weigh-in entry with auto-timestamp; set a target; visualize trend with **1H / 24H / 7D / 30D / 1Y / All / Custom-range** filters.
- **Daily todos** — one simple list per day, auto-rolls at local midnight; previous days stay viewable.
- **Meal times** — log when you eat, see a timeline.
- **Water** — count cups against a configurable daily goal.
- **Dark / light theme** — electric-lime accent (`#C8F400`) on chalk-white or iron-black.
- **PWA** — installable to home screen, works offline.

## Stack

| | |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev) |
| Language | TypeScript |
| Styling | [Tailwind v4](https://tailwindcss.com) with CSS-variable theme |
| Storage | `localStorage` (typed wrapper in `src/lib/storage`) |
| Charts | [Recharts](https://recharts.org) (added Phase 4) |
| Deployment | [Vercel](https://vercel.com) |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | ESLint |
| `npm run icons` | Regenerate PWA icons from the brand mark |

## Project structure

See [CLAUDE.md](CLAUDE.md) for the folder layout, theme tokens, and conventions.

## Phased build

The app is built in **8 phases** + a version-control phase. See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for the full per-phase deliverables and commit plan.

| Phase | Status |
|---|---|
| 1 — Foundation (shell, theme, logo, PWA) | ✅ |
| 2 — Storage + dashboard | ✅ |
| 3 — Weight entry + target | ✅ |
| 4 — Weight graph | ✅ |
| 5 — Daily todos | ✅ |
| 6 — Meal times | ✅ |
| 7 — Water tracking | ✅ |
| 8 — Polish + deploy | ✅ |
| 9 — Version control | ⏳ |

## Deploying to Vercel

The project is a stock Next.js app with no custom server requirements — Vercel will pick it up automatically.

**Easiest path (GitHub integration):**

1. Visit [vercel.com/new](https://vercel.com/new).
2. Import the `ISH-WORKOUT` GitHub repo.
3. Leave all defaults — Vercel auto-detects Next.js 16, sets the build command to `next build`, output to `.next/`.
4. Click **Deploy**. First build takes ~1 minute. Every push to `main` redeploys.

**CLI alternative:**

```bash
npx vercel        # one-time: log in, link to a project
npx vercel --prod # deploy production
```

No environment variables are required — the app is fully client-side.

## Data portability

Everything lives in `localStorage`, so it's per-device. Use **Settings → Data → Export JSON** to save a backup or move data to another device, then **Import JSON** on the new one.

## License

Personal project — all rights reserved by the author.
