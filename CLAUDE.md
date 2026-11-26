# CLAUDE.md

Anthem Tracker ("Programación de Cantos"): a Next.js app for planning which songs (himnos, salmos, cantos) are sung at each church service and tracking how often each song has been used recently. The UI text is in Spanish.

## Stack

- **Next.js 16 App Router** (Turbopack is the default bundler for dev and build), React 19, TypeScript (`strict`, but `any` is used widely). Dynamic route `params` is a Promise: `const { id } = await params`.
- **Chakra UI 2** (+ Emotion, framer-motion) for all UI; theme in `app/theme.tsx`. Chakra v3 is a rewrite, so staying on v2 is deliberate. `app/providers.tsx` has its own Emotion cache provider (`compat = true` + `useServerInsertedHTML`); `@chakra-ui/next-js`'s `CacheProvider` caused React 19 hydration errors because Chakra's global styles didn't get its cache.
- **Prisma 5** (6+ changes the setup; upgrade separately) with **PostgreSQL** (`lib/prisma.ts` exports a single `prisma` client)
- **NextAuth 4** (4.24+, supports Next 16) with Prisma adapter, GitHub + Google providers; custom sign-in page at `/login`
- Hosted on **Vercel**; Node.js version is pinned via `engines` in `package.json` (overrides the Vercel project setting). Vercel runs the `vercel-build` script instead of `build`: `prisma generate`, then `prisma migrate deploy` only when `VERCEL_ENV=production` (previews share the DB, so they must not migrate it), then `next build`. Merging a PR with a migration applies it to production.
- **Vitest** integration tests for the API routes in `tests/api`, run against a real local Postgres. ESLint 9 flat config in `eslint.config.mjs` (`eslint-config-next`; `no-explicit-any` off). `next build` doesn't run lint.

## Commands

```bash
npm run db:up        # local Postgres in Docker (localhost:5433): anthem, anthem_test, anthem_shadow
npm run db:setup     # prisma migrate deploy + seed, against .env's DATABASE_URL
npm run dev          # local dev server
npm run dev:login    # create a local user + session, prints the cookie to paste in the browser
npm test             # Vitest integration tests (needs db:up); npm run test:watch
npm run build        # production build (also the main type check)
npm run lint         # eslint . (next lint was removed in Next 16)
npx prisma generate  # regenerate client after schema changes
npx prisma migrate dev --name <change>   # create + apply a migration locally after editing schema.prisma
npx prisma migrate deploy                 # apply pending migrations (Vercel runs this on production deploys)
npx prisma db seed   # runs prisma/seed.ts with tsx — WIPES the Song table and reloads prisma/data.js
```

Local setup steps for humans are in `README.md`.

## Environment variables

`.env.example` documents them all; local values go in `.env` (gitignored; Prisma's CLI only reads `.env`, not `.env.local`): `DATABASE_URL`, `SHADOW_DATABASE_URL`, `TEST_DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Production values live in Vercel project settings.

## Testing

- Tests call route handlers directly (`POST(jsonRequest(...))`) with Prisma pointed at `TEST_DATABASE_URL`. `tests/env.ts` points `DATABASE_URL` at the test DB before anything imports Prisma, `tests/setup.ts` mocks `getCurrentUser` and empties every table before each test, and `tests/global-setup.ts` runs `prisma migrate deploy` on the test DB once. Test files run one at a time (shared DB).
- Helpers in `tests/helpers.ts`: `logInAs()`, `logOut()`, `createSongs()`, `servicePayload()` (same shape as `toProgramInputs`), `songDates()`.
- `tests/test-database.ts` and `scripts/dev-login.ts` refuse to run against a non-local database. Keep that guard on anything that writes test data.
- When changing API behavior, add or update a test in `tests/api` and run `npm test`.

## Layout

- `app/` — routes
  - `page.tsx` — home (just the NavBar)
  - `login/` — custom NextAuth sign-in page
  - `programs/current/` — the current service program; `current/new/` creates one (auth required)
  - `programs/history/` — list of all FullPrograms; `[id]/` view, `[id]/edit/` edit (auth required)
  - `programs/songs/` — song catalog with usage info; add new songs
  - `api/fullprogram` (POST/PUT/DELETE a whole service) and `api/song` (POST; accepts only `name`, `type` ∈ himno/salmo/canto and optional `number`, 400 otherwise) — route handlers called from client components via `fetch`
  - `api/auth/[...nextauth]/route.ts` — exports `authOptions` (imported by other routes/pages)
- `components/` — client components (`'use client'`) that hold the actual UI; pages are thin server components that query Prisma and pass data as props
- `lib/Utils.ts` — client-safe helpers: sort functions per song type, date formatting, month names, repeat colors, emoji numbers, `toProgramInputs` (builds the `/api/fullprogram` payload)
- `lib/programs.ts` — server-side program helpers used inside transactions: `addSongDates`, `removeSongDates`, `clearCurrent`, `PROGRAM_TYPES`
- `prisma/` — `schema.prisma`, `migrations/` (baseline `0_init` = schema as of Nov 2026), `seed.ts`, `data.js` (the hymnal catalog: ~280 himnos, ~40 salmos, ~30 cantos)

## Domain model

- **Song**: `type` is one of `himno` | `salmo` | `canto`. `number` is set for himnos. `dates: DateTime[]` is a denormalized list of every date the song was used — it's maintained manually by the program API routes, not derived from relations.
- **Program**: one service section on a date. `type` is one of `recibimiento` | `matutino` | `vespertino`. Many-to-many with Song. `order` is JSON `{ [songName]: position }`. `isCurrent` marks the current program per type.
- **FullProgram**: groups the three Programs for one date; also has `isCurrent`.
- **User/Account/Session**: standard NextAuth schema.

### How data flows

- A service is one FullProgram with exactly one Program per type. `NewProgramPage`, `EditProgramPage` and `CurrentProgram` (delete) each make a single `/api/fullprogram` request (`{ id?, date, isCurrent, programs: [{ type, songs: [{ id }], order }] }`), and the handler writes the FullProgram, its Programs and song dates in one `prisma.$transaction`. Publishing (`isCurrent`) clears the flag on every other FullProgram and Program. Pages show an error toast and stay put if the request fails.
- Each program write also appends/removes the program date in `Song.dates` (`addSongDates`/`removeSongDates` in `lib/programs.ts`). The API reads the stored programs and song dates from the DB, not the client's copy. Removal drops one occurrence, since a song can be in several programs on the same date. If you change program logic, keep `Song.dates` consistent.
- After mutations, the client does `router.push('/programs/history?refresh=true')` or `location.reload()`. Data pages use `export const dynamic = 'force-dynamic'` so they always read fresh data (that's what the recent commits fixed). Keep that on any page that reads from the DB.
- Song usage coloring (`SongList`): counts uses in the last 30 days → teal (0), yellow (1), red (2+).

## Conventions and gotchas

- Path alias `@/*` → repo root.
- Auth: protected pages call `getServerSession(authOptions)` and redirect; client-side `AuthCheck` hides edit/delete controls for anonymous users. Every API handler must start with `getCurrentUser()` from `lib/auth.ts` and return `unauthorized()` (401) when it's null. Any logged-in user can modify any program (no per-author ownership checks).
- `getCurrentUser()` looks up the user by `session.user.id`, which the NextAuth `session` callback adds (typed in `types/next-auth.d.ts`). Sessions use the database strategy (Prisma adapter), so the callback receives the DB `user`.
- Each API handler runs all its writes in one `prisma.$transaction`; keep multi-step writes inside it.
- Dates come from `<input type="date">` (UTC midnight); `parseDate` formats as `DD-MM-YYYY`.
- `package-lock.json` must stay in sync with `package.json` (`npm ci` fails otherwise). Use npm on Node 26.
