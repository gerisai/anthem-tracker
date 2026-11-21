# CLAUDE.md

Anthem Tracker ("Programación de Cantos"): a Next.js app for planning which songs (himnos, salmos, cantos) are sung at each church service and tracking how often each song has been used recently. The UI text is in Spanish.

## Stack

- **Next.js 13.4 App Router**, React 18, TypeScript (`strict`, but `any` is used widely)
- **Chakra UI 2** (+ Emotion, framer-motion) for all UI; theme in `app/theme.tsx`
- **Prisma 5** with **PostgreSQL** (`lib/prisma.ts` exports a single `prisma` client)
- **NextAuth 4** with Prisma adapter, GitHub + Google providers; custom sign-in page at `/login`
- Hosted on **Vercel**
- No test framework. No linter config beyond `next lint`.

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build (also the main type check)
npm run lint
npx prisma generate  # regenerate client after schema changes
npx prisma migrate dev   # migrations dir is gitignored (*/migrations)
npx prisma db seed   # runs prisma/seed.ts — WIPES the Song table and reloads prisma/data.js
```

## Environment variables

Stored in `.env` (gitignored): `DATABASE_URL`, `SHADOW_DATABASE_URL`, `GITHUB_ID`, `GITHUB_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, plus the usual NextAuth vars (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`). Production values live in Vercel project settings.

## Layout

- `app/` — routes
  - `page.tsx` — home (just the NavBar)
  - `login/` — custom NextAuth sign-in page
  - `programs/current/` — the current service program; `current/new/` creates one (auth required)
  - `programs/history/` — list of all FullPrograms; `[id]/` view, `[id]/edit/` edit (auth required)
  - `programs/songs/` — song catalog with usage info; add new songs
  - `api/program`, `api/fullprogram`, `api/song` — route handlers (POST/PUT/DELETE), called from client components via `fetch`
  - `api/auth/[...nextauth]/route.ts` — exports `authOptions` (imported by other routes/pages)
- `components/` — client components (`'use client'`) that hold the actual UI; pages are thin server components that query Prisma and pass data as props
- `lib/Utils.ts` — sort functions per song type, date formatting, month names, repeat colors, emoji numbers
- `prisma/` — `schema.prisma`, `seed.ts`, `data.js` (the hymnal catalog: ~280 himnos, ~40 salmos, ~30 cantos)

## Domain model

- **Song**: `type` is one of `himno` | `salmo` | `canto`. `number` is set for himnos. `dates: DateTime[]` is a denormalized list of every date the song was used — it's maintained manually by the program API routes, not derived from relations.
- **Program**: one service section on a date. `type` is one of `recibimiento` | `matutino` | `vespertino`. Many-to-many with Song. `order` is JSON `{ [songName]: position }`. `isCurrent` marks the current program per type.
- **FullProgram**: groups the three Programs for one date; also has `isCurrent`.
- **User/Account/Session**: standard NextAuth schema.

### How data flows

- Creating a program (`NewProgramPage`): client POSTs three `/api/program` requests (one per type), then POSTs `/api/fullprogram` with the created ids. Setting `isCurrent` flips the previous current record(s) to `false`.
- Each program write also appends/removes the program date in `Song.dates`. When editing or deleting, the client sends the old song list so the API can clean up dates. If you change program logic, keep `Song.dates` consistent.
- Deleting (`CurrentProgram`) deletes each Program, then the FullProgram.
- After mutations, the client does `router.push('/programs/history?refresh=true')` or `location.reload()`. Data pages use `export const dynamic = 'force-dynamic'` so they always read fresh data (that's what the recent commits fixed). Keep that on any page that reads from the DB.
- Song usage coloring (`SongList`): counts uses in the last 30 days → teal (0), yellow (1), red (2+).

## Conventions and gotchas

- Path alias `@/*` → repo root.
- Auth: protected pages call `getServerSession(authOptions)` and redirect; client-side `AuthCheck` hides edit/delete controls for anonymous users. **API routes do not check auth**: `/api/song` and the DELETE handlers accept anonymous requests. Keep this in mind before adding features.
- API routes look up the user by `session.user.name` (not email/id).
- No DB transactions: multi-step writes are sequential `await`s, and `POST /api/program` updates song dates in a non-awaited `forEach`.
- Dates come from `<input type="date">` (UTC midnight); `parseDate` formats as `DD-MM-YYYY`.
- Dependencies are from mid-2023 (Next 13.4, NextAuth 4, Prisma 5). Treat any upgrade as its own task.
