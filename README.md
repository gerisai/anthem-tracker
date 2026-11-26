# Anthem Tracker

Plans which songs (himnos, salmos, cantos) are sung at each church service and tracks how often each song has been used recently. Next.js + Prisma (PostgreSQL) + NextAuth, hosted on Vercel.

## Local development

Requirements: Node 26 (`nvm use 26`) and Docker Desktop.

```bash
npm ci
cp .env.example .env        # then set NEXTAUTH_SECRET: openssl rand -base64 32
npm run db:up               # Postgres on localhost:5433 (anthem, anthem_test, anthem_shadow)
npm run db:setup            # apply migrations + seed the song catalog
npm run dev                 # http://localhost:3000
```

`npm run db:down` stops Postgres; the data stays in the `postgres-data` Docker volume. To start from scratch: `docker compose down -v`.

### Logging in locally

There are two ways to log in.

**Dev login script.** No setup needed:

```bash
npm run dev:login            # or: npm run dev:login -- "Some Name"
```

It creates a user and session in the local database and prints a `document.cookie = ...` line. Paste it into the browser console on `http://localhost:3000` and reload. The script refuses to run unless `DATABASE_URL` points to localhost.

**GitHub OAuth app.** This goes through the real login flow:

1. Go to GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**.
2. Set **Homepage URL** to `http://localhost:3000` and **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`.
3. Copy the client ID and generate a client secret into `GITHUB_ID` and `GITHUB_SECRET` in `.env`, then restart `npm run dev`.

Use a separate OAuth app from production, because production's callback URL points to the deployed site. Google works the same way: create an OAuth client with the redirect URI `http://localhost:3000/api/auth/callback/google`.

## Tests

```bash
npm test             # or npm run test:watch
```

These are Vitest integration tests for the API routes (`tests/api`). They run against the `anthem_test` database, which every test empties, so Postgres must be running (`npm run db:up`). The logged-in user is mocked; see `tests/helpers.ts` (`logInAs`, `logOut`).

## Database changes

Edit `prisma/schema.prisma`, then run `npx prisma migrate dev --name <change>` and commit the new folder in `prisma/migrations`. Production applies pending migrations on deploy (`vercel-build`).
