# CLAUDE.md

Anthem Tracker ("Programación de Cantos"): a Next.js app for planning which songs (himnos, salmos, cantos) are sung at each church service and tracking how often each song has been used recently. The UI text is in Spanish.

## Stack

- **Next.js 16 App Router** (Turbopack is the default bundler for dev and build), React 19, TypeScript (`strict`, but `any` is used widely). Dynamic route `params` is a Promise: `const { id } = await params`.
- **Chakra UI 3** (+ Emotion) for all UI. v3 uses compound components (`Tabs.Root`/`Tabs.Trigger`, `Menu.Root`, `Drawer.Root`, `Switch.Root`, `Field.Root`, `Tag.Root`…), `colorPalette` instead of `colorScheme`, `loading`/`disabled`/`open` instead of `isLoading`/`isDisabled`/`isOpen`, icons as button children, and `asChild` to render a Next `Link` as a `Button`. The system is in `app/theme.tsx` (`createSystem`): v2's default heading size and light/dark semantic tokens: `page` (body background, `gray.800` in dark), `surface` (nav bar, sections, menus, drawers; `.hover`, `.track` for unchecked switches) and a dark `border` of `whiteAlpha.300` (v3's `gray.800` would vanish on the page background). Use these tokens (and Chakra's `fg`) instead of fixed `gray.X`/`white`, so both modes work. Light/dark mode: `next-themes`' `ThemeProvider` in `providers.tsx` puts the `light`/`dark` class on `<html>` (dark by default, no system preference) and `components/ColorModeButton.tsx` (a floating button in the bottom-right corner, rendered once in `providers.tsx`) toggles it (saved in localStorage); `<html>` has `suppressHydrationWarning` for that. Toasts: `toaster.create({ title, type })` from `components/ui/toaster.tsx` (rendered once in `providers.tsx`). `app/providers.tsx` keeps its own Emotion cache provider (`compat = true` + `useServerInsertedHTML`) so server-rendered styles don't cause React 19 hydration errors.
- **Prisma 7** with **PostgreSQL**. The `prisma-client` generator writes the client to `generated/prisma` (gitignored; `postinstall` runs `prisma generate`), so import types and enums from `@/generated/prisma/client`, not `@prisma/client`. `lib/prisma.ts` exports the single `prisma` client, built with the `@prisma/adapter-pg` driver adapter on `DATABASE_URL`; scripts and the seed import it too. The CLI's settings (schema, migrations, seed command, URLs) live in `prisma.config.ts`, which loads `.env` itself with `process.loadEnvFile()` (already-set variables win). `@next-auth/prisma-adapter` is typed against the old `@prisma/client` export, hence the cast in the NextAuth route.
- **NextAuth 4** (4.24+, supports Next 16) with Prisma adapter, GitHub + Google providers; custom sign-in page at `/login`
- Hosted on **Vercel**; Node.js version is pinned via `engines` in `package.json` (overrides the Vercel project setting). `vercel.json`'s `buildCommand` runs `scripts/vercel-build.sh`: `prisma generate`, then `prisma migrate deploy` only when `VERCEL_ENV=production` (previews share the DB, so they must not migrate it), then `next build`. It fails if `VERCEL_ENV` is missing rather than skip silently. Merging a PR with a migration applies it to production; its preview will error wherever the new schema is used. Don't use a `vercel-build` npm script: the Next.js preset ignores it (that's why migrations never ran before).
- **Vitest** integration tests for the API routes in `tests/api` and unit tests in `tests/lib`, run against a real Postgres. **GitHub Actions CI** (`.github/workflows/ci.yml`) runs lint, `tsc`, tests (Postgres 17 service container, `TEST_DATABASE_URL` only, no `.env`) and build on every PR and push to `main`. If you add a required env var or setup step for tests or build, add it to the workflow too. ESLint 10 flat config in `eslint.config.mjs` (`eslint-config-next`; `no-explicit-any` off; `generated/` ignored). Its bundled `eslint-plugin-react`, `-import` and `-jsx-a11y` don't list ESLint 10 in their peer ranges yet, so npm warns `ERESOLVE overriding peer dependency`; they work (checked rule by rule). `next build` doesn't run lint.

## Commands

```bash
npm run db:up        # local Postgres in Docker (localhost:5433): anthem, anthem_test, anthem_shadow
npm run db:setup     # prisma migrate deploy + seed, against .env's DATABASE_URL
npm run dev          # local dev server
npm run dev:login    # create a local user + session (-- "Name" [viewer|editor|admin], default editor); prints the cookie
npm run user:role    # list users, or -- <email|id> <role> to set one (uses DATABASE_URL env first, then .env)
npm test             # Vitest integration tests (needs db:up); npm run test:watch
npm run build        # production build (also the main type check)
npm run lint         # eslint . (next lint was removed in Next 16)
npx prisma generate  # regenerate client after schema changes
npx prisma migrate dev --name <change>   # create + apply a migration locally after editing schema.prisma (then prisma generate; v7 doesn't run it)
npx prisma migrate deploy                 # apply pending migrations (Vercel runs this on production deploys)
npx prisma db seed   # runs prisma/seed.ts with tsx (prisma.config.ts; migrate dev/reset no longer seed) — WIPES the Song table and reloads prisma/data.js
```

Local setup steps for humans are in `README.md`.

## Environment variables

`.env.example` documents them all; local values go in `.env` (gitignored; Prisma's CLI only reads `.env`, not `.env.local`): `DATABASE_URL`, `DIRECT_URL`, `SHADOW_DATABASE_URL`, `TEST_DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Production values live in Vercel project settings. In production `DATABASE_URL` is Neon's **pooled** connection (app runtime) and `DIRECT_URL` is the **direct** one (Prisma CLI only, as `datasource.url` in `prisma.config.ts`; the pooler's transaction mode breaks migrate's advisory lock). `DIRECT_URL` is only needed for Production (previews don't migrate); `vercel-build.sh` fails a production build without it. Anything that runs migrations against another database (like `tests/global-setup.ts`) must override `DIRECT_URL` too, or Prisma falls back to `.env`'s. Prisma 7 rejects a shadow database equal to the main one, so global-setup blanks `SHADOW_DATABASE_URL`.

## Testing

- Tests call route handlers directly (`POST(jsonRequest(...))`) with Prisma pointed at `TEST_DATABASE_URL`. `tests/env.ts` points `DATABASE_URL` at the test DB before anything imports Prisma, `tests/setup.ts` mocks `getCurrentUser` and empties every table before each test, and `tests/global-setup.ts` runs `prisma migrate deploy` on the test DB once. Test files run one at a time (shared DB).
- Helpers in `tests/helpers.ts`: `logInAs(name, role = 'editor')`, `logOut()`, `createSongs()`, `servicePayload()` (same shape as `toProgramInputs`), `songDates()`.
- `tests/test-database.ts` and `scripts/dev-login.ts` refuse to run against a non-local database. Keep that guard on anything that writes test data.
- When changing API behavior, add or update a test in `tests/api` and run `npm test`.

## Layout

- `app/` — routes
  - `/` has no page: `next.config.js` redirects it (307, not permanent) to `/programs/current`. A config redirect runs in Vercel's routing layer without invoking a function. Login's `callbackUrl: '/'` therefore lands on the current program.
  - `login/` — custom NextAuth sign-in page
  - `programs/current/` — the current service program; `current/new/` creates one (auth required)
  - `programs/history/` — list of all FullPrograms; `[id]/` view, `[id]/edit/` edit (auth required)
  - `programs/songs/` — song catalog with usage info; add new songs
  - `api/fullprogram` (POST/PUT/DELETE a whole service) and `api/song` (POST; accepts only `name`, `type` ∈ himno/salmo/canto and optional `number`, 400 otherwise) — route handlers called from client components via `fetch`
  - `api/auth/[...nextauth]/route.ts` — exports `authOptions` (imported by other routes/pages)
- `components/` — client components (`'use client'`) that hold the actual UI; pages are thin server components that query Prisma and pass data as props. Shared pieces: `ProgramEditor` (the new/edit service layout; side by side from `lg`, stacked below; songs are dragged with `@dnd-kit/core` + `@dnd-kit/sortable` (mouse, or touch press-and-hold) from the catalog into a section, within a section to reorder, or between sections; drag ids are `<type>:<songId>` for section songs, droppables are the section types. Keyboard has no `KeyboardSensor` (it scrolls the song list instead of moving to a section): 1/2/3 add a focused catalog song or move a section song, ↑/↓ reorder, Enter/click removes. A section lists each song once), `SongTabs` (one tab per song type; with `onAddSong`, songs can be dragged onto a section inside `ProgramEditor`'s `DndContext`), `ProgramSection` (one service section box), `ui/toaster`
- Responsive layout: `app/programs/layout.tsx` wraps every page in one container (`maxW="7xl"`, side padding `{ base: 4, md: 8 }`), so pages use `w="100%"` (plus a `maxW` if needed) instead of fixed percentages or their own margins. Use Chakra responsive values (`{ base, md, lg }`) and check new UI at phone width (375px) for horizontal overflow. The NavBar is two rows on phones.
- `lib/Utils.ts` — client-safe helpers: sort functions per song type, date formatting, month names, repeat colors, emoji numbers, `toProgramInputs` (builds the `/api/fullprogram` payload), `recentDates` (last-30-days usage for `SongList`), `groupByMonth` (services by month, oldest first) and `groupByYear` (newest year first, its months January → December, for the expandable history page)
- `lib/useProgramSongs.ts` — state hook for the new/edit service pages; `addSong` (optional index)/`removeSong`/`moveSong` are pure (never mutate state, so reset works)
- `lib/programs.ts` — server-side program helpers used inside transactions: `addSongDates`, `removeSongDates`, `clearCurrent`, `PROGRAM_TYPES`
- `prisma.config.ts` — Prisma CLI config; `generated/prisma` — generated client (gitignored)
- `prisma/` — `schema.prisma`, `migrations/` (baseline `0_init` = schema as of Nov 2026), `seed.ts`, `data.js` (the hymnal catalog: ~280 himnos, ~40 salmos, ~30 cantos)

## Domain model

- **Song**: `type` is one of `himno` | `salmo` | `canto`. `number` is set for himnos. `dates: DateTime[]` is a denormalized list of every date the song was used — it's maintained manually by the program API routes, not derived from relations.
- **Program**: one service section on a date. `type` is one of `recibimiento` | `matutino` | `vespertino`. Many-to-many with Song. `order` is JSON `{ [songName]: position }`. `isCurrent` marks the current program per type.
- **FullProgram**: groups the three Programs for one date; also has `isCurrent`.
- **User/Account/Session**: standard NextAuth schema, plus `User.role` (`Role` enum: `viewer` default, `editor`, `admin`). Every new GitHub/Google login starts as `viewer`.

### How data flows

- A service is one FullProgram with exactly one Program per type. `NewProgramPage`, `EditProgramPage` and `CurrentProgram` (delete) each make a single `/api/fullprogram` request (`{ id?, date, isCurrent, programs: [{ type, songs: [{ id }], order }] }`), and the handler writes the FullProgram, its Programs and song dates in one `prisma.$transaction`. Publishing (`isCurrent`) clears the flag on every other FullProgram and Program. Pages show an error toast and stay put if the request fails.
- Each program write also appends/removes the program date in `Song.dates` (`addSongDates`/`removeSongDates` in `lib/programs.ts`). The API reads the stored programs and song dates from the DB, not the client's copy. Removal drops one occurrence, since a song can be in several programs on the same date. If you change program logic, keep `Song.dates` consistent.
- After mutations, the client does `router.push('/programs/history')` (or `location.reload()` for songs). Data pages use `export const dynamic = 'force-dynamic'`, and Next 16 doesn't keep dynamic pages in the client router cache (`staleTimes.dynamic` is 0), so a push always fetches fresh data. The old `?refresh=true` + `router.refresh()`-during-render workaround (for Next 13's 30s cache) was removed. Keep `force-dynamic` on any page that reads from the DB.
- Song usage coloring (`SongList`): counts uses in the last 30 days → teal (0), yellow (1), red (2+). The count badge's dates are a popover that opens on mouse hover and on click/tap (Chakra/Ark tooltips never open on touch).

## Conventions and gotchas

- Path alias `@/*` → repo root.
- Auth: every API handler starts with `getCurrentUser()` from `lib/auth.ts` and returns `unauthorized()` (401) when it's null.
- Permissions live in `lib/permissions.ts` (client-safe, shared by API and UI): `canCreate(user)` (editor/admin create services and songs) and `canModify(user, ownerId)` (admins any service; editors only where `FullProgram.userId` is theirs). APIs return `forbidden()` (403) and `notFound()` (404); `/api/fullprogram` PUT/DELETE check via `checkCanModify` before the transaction. Protected pages redirect (`/programs/current/new` needs `canCreate`, `[id]/edit` needs `canModify`). `<AuthCheck editor>` and `<AuthCheck ownerId={...}>` hide controls the user can't use. Editing keeps the original author on the FullProgram and its Programs.
- `getCurrentUser()` looks up the user by `session.user.id`; the NextAuth `session` callback adds `id` and `role` (typed in `types/next-auth.d.ts`). Sessions use the database strategy (Prisma adapter), so the callback receives the DB `user`.
- Each API handler runs all its writes in one `prisma.$transaction`; keep multi-step writes inside it.
- Dates come from `<input type="date">` (UTC midnight); `parseDate` formats as `DD-MM-YYYY` from the ISO (UTC) string. Always use UTC getters (`getUTCMonth`, `getUTCFullYear`) on these dates: local getters shift them a day back in the Americas, and the server renders in UTC while the browser doesn't. `tests/lib/utils.test.ts` runs with `TZ=America/Mexico_City` to catch this.
- `package-lock.json` must stay in sync with `package.json` (`npm ci` fails otherwise). Use npm on Node 26.
