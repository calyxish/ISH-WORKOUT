# ISH Workout — Implementation plan

A personal life-management PWA. Built in **8 build phases** plus a **version-control phase** at the end. Each build phase ships a working app you can open in the browser and verify before moving on.

## Confirmed decisions

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + React 19 + TypeScript |
| Styling | Tailwind v4, CSS-variable theme |
| Storage | `localStorage` (wrapped in `src/lib/storage` for future swap) |
| Auth | None — single user, single device |
| PWA | Yes — `app/manifest.ts` + `public/sw.js`, installable to home screen |
| Day boundary | Local midnight; computed read-time (no scheduled jobs) |
| Logo | Hand-coded SVG mark + wordmark, lime on iron-black |
| Tests | None initially. May add Vitest for weight bucketing logic before Phase 4 if requested |
| Deployment | Vercel |

## Build phases

| # | Phase | What ships | Status |
|---|---|---|---|
| 1 | **Foundation** | Next.js + TS + Tailwind v4; CSS-variable theme + dark mode; `ThemeScript` (no FOUC) + `ThemeToggle`; hand-coded SVG `<Mark />` + `<Logo />`; favicon + apple-icon + PWA icons (192/512/maskable); `manifest.ts`; service worker registered in production; responsive shell (desktop sidebar + mobile top bar / bottom nav); dashboard + stub pages for weight/todos/meals/water/settings. | ✅ |
| 2 | **Storage + dashboard** | Typed `lib/storage` (`getCollection`, `pushItem`, `updateItem`, `removeItem`, SSR-safe); `useCollection` hook; date utilities (`startOfDay`, range bucketing); dashboard cards showing today's snapshot per feature, with empty states. | ✅ |
| 3 | **Weight entry + target** | `/weight` route: number input + auto-timestamped "Log weight"; recent-entries list (edit / delete); set target weight; delta-to-target display. | ✅ |
| 4 | **Weight graph** | Recharts line chart; range pills **1H / 24H / 7D / 30D / 1Y / All / Custom**; target as dashed reference line; bucketing per range (raw ≤24H, daily avg week+, monthly avg year). Custom range = two date pickers. | ✅ |
| 5 | **Daily todos** | `/todos`: add / check / edit / delete; "today" view + previous-days history (read-only); automatic midnight rollover (read-time); progress count. | ✅ |
| 6 | **Meal times** | `/meals`: add meal (optional label, time defaults to now, editable); today's timeline; previous-days history. | ✅ |
| 7 | **Water tracking** | `/water`: +/− cup buttons, configurable daily goal, progress ring; daily reset at midnight; history kept. | ✅ |
| 8 | **Polish + deploy** | Settings (target weight, water goal, theme, **export/import JSON**); a11y pass (keyboard, focus rings, aria-labels); responsive sweep; deploy to Vercel. | ✅ |
| 9 | **Version control** | Create public GitHub repo `ISH-WORKOUT`; split phases 1–8 into 8 issues / 8 branches / 8 PRs per the proper-VC workflow; one PR at a time, waiting for review/merge approval between each. | ✅ in review |

## Verification before Phase 9

1. `npm run dev` → open `localhost:3000` in Chrome. Toggle light/dark. Install as PWA from address bar.
2. Log 5 weights at different timestamps; set a target; verify graph re-buckets for each range.
3. Add todos, tick some, advance system date by a day, reload — yesterday archived, today empty.
4. Log meals, see timeline.
5. Tap water cups past goal, see ring overflow.
6. Export JSON, clear localStorage, import — data restored.
7. Vercel URL on phone: install PWA from share menu, repeat the flow.

## Phase 9 — Version control workflow

Each phase becomes one issue → one branch → one PR. Branch names are semantic (no issue numbers). Commits inside each branch are logical units, Conventional-Commit-formatted, with `Refs #N` in the body. PRs use `Closes #N` to auto-close.

| # | Issue title | Branch name | Commits within the branch (in order) | Closes |
|---|---|---|---|---|
| 1 | Phase 1 — Foundation (shell, theme, logo, PWA) | `feat/foundation` | `chore(setup): scaffold next.js 16 + tailwind v4` → `feat(theme): css-variable theme with light/dark toggle` → `feat(brand): svg mark + logo + generated pwa icons` → `feat(pwa): manifest + service worker` → `feat(shell): responsive sidebar + bottom-nav shell` → `feat(home): dashboard with stub feature pages` → `docs(setup): claude.md, implementation plan, readme` | #1 |
| 2 | Phase 2 — Storage layer + dashboard snapshots | `feat/storage-and-dashboard` | `feat(types): shared entity types` → `feat(storage): typed localStorage abstraction + reactive hooks` → `feat(util): date helpers` → `feat(home): live dashboard snapshot tiles` | #2 |
| 3 | Phase 3 — Weight entry + target | `feat/weight-entry` | `feat(ui): button, input, empty-state, icon primitives` → `feat(weight): entry form with auto-timestamp` → `feat(weight): history list with edit/delete` → `feat(weight): target weight + delta` | #3 |
| 4 | Phase 4 — Weight chart with range filters | `feat/weight-chart` | `chore(deps): add recharts` → `feat(weight): range bucketing logic` → `feat(weight): chart with range pills + target line + custom range` | #4 |
| 5 | Phase 5 — Daily todos | `feat/todos` | `feat(todos): add/check/edit/delete with midnight rollover` → `feat(todos): grouped history view` | #5 |
| 6 | Phase 6 — Meal times | `feat/meals` | `refactor(util): hoist datetime-local helpers to shared module` → `feat(meals): entry form + today timeline + history` | #6 |
| 7 | Phase 7 — Water tracking | `feat/water` | `feat(water): types + helpers + svg progress ring` → `feat(water): cup counter, configurable goal, history` | #7 |
| 8 | Phase 8 — Settings, export/import, deploy-ready | `chore/polish-and-deploy` | `feat(theme): system mode + lint-clean store via useSyncExternalStore` → `feat(settings): goals, theme picker, json export/import/clear` → `polish(a11y): bottom-nav clearance + focus rings + aria labels` → `docs(deploy): vercel deploy steps in readme` | #8 |

| Step | Who | What |
|---|---|---|
| 1 | Claude | `gh issue create` → return issue number |
| 2 | Claude | `git checkout -b <branch>` from default branch |
| 3 | Claude | For each logical commit: stage only that commit's files, commit with Conventional Commits message + `Refs #N` |
| 4 | Claude | `git push -u origin <branch>` |
| 5 | Claude | `gh pr create` with `Closes #N` in body, commit-by-commit table, test plan |
| 6 | Claude | Print issue/branch/PR URLs, **STOP**, wait for approval |
| 7 | You | Review on GitHub. Reply "approved" or request changes |
| 8 | Claude | On approval: `gh pr merge <N> --merge --delete-branch`, pull default, verify issue auto-closed, propose next phase |

## Honest notes

- **Phase 9 risk:** Phases 1–8 land as one big uncommitted blob. Splitting that into 8 clean per-phase branches takes care to stage only that phase's files per commit. Flagged in the original plan — you opted to defer git until the end.
- **`next-pwa` skipped:** Next.js 16 has native manifest support; the service worker is small enough (~40 lines) that a third-party plugin is overkill.
- **No tests yet** — only manual browser verification per phase. Easy to add Vitest for the bucketing logic before Phase 4 if you want.
