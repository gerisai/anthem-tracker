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

There are three ways to log in.

**Dev login script.** No setup needed:

```bash
npm run dev:login                      # "Dev User", editor
npm run dev:login -- "Some Name" admin # any name; role: viewer, editor (default) or admin
```

It creates or updates a user and session in the local database and prints a `document.cookie = ...` line. Paste it into the browser console on `http://localhost:3000` and reload. If you're already logged in, click **Cerrar Sesión** first: the existing session cookie is httpOnly, so the pasted line can't replace it. The script refuses to run unless `DATABASE_URL` points to localhost.

**GitHub OAuth app.** This goes through the real login flow:

1. Go to GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**.
2. Set **Homepage URL** to `http://localhost:3000` and **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`.
3. Copy the client ID and generate a client secret into `GITHUB_ID` and `GITHUB_SECRET` in `.env`, then restart `npm run dev`.

**Google OAuth client.** This also goes through the real login flow:

1. In the [Google Cloud Console](https://console.cloud.google.com), select or create a project (a separate one for local work, such as `anthem-tracker-dev`, keeps it apart from production).
2. Go to **Google Auth Platform** (*APIs & Services → OAuth consent screen* in older layouts) → **Get started**. Enter an app name and your email as the support and contact email, and choose **External** as the audience.
3. In **Audience**, leave the publishing status as **Testing** and add your Gmail under **Test users**. While the app is in Testing, only test users can log in. NextAuth only requests `openid`, `email` and `profile`, so Google doesn't need to review the app.
4. Go to **Clients → Create client** and choose **Web application**:
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy the client ID and secret into `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env` (the secret may only be shown once), then restart `npm run dev`.

Common problems:
- **`redirect_uri_mismatch`:** the redirect URI must match exactly (`http`, port `3000`, no trailing slash). Changes can take a few minutes to apply.
- **`OAuthAccountNotLinked`:** NextAuth won't link GitHub and Google logins that share an email. Locally, use one provider per email, or reset with `docker compose down -v && npm run db:up && npm run db:setup`. `dev:login` users use `@localhost` emails, so they never conflict.

Keep the local GitHub app and Google client separate from production's. Production's callback URLs point to the deployed site, and its credentials stay in Vercel.

New users who log in through GitHub or Google start as **viewers**. Give yourself a role with `npm run user:role` (see below).

## Roles

| Role | Can |
|---|---|
| `viewer` (default for every new login) | View services and songs |
| `editor` | Also create services and songs, and edit or delete **their own** services |
| `admin` | Also edit or delete **any** service |

The rules live in `lib/permissions.ts`. The API enforces them with 403 responses, and the UI hides controls the user can't use.

```bash
npm run user:role                              # list users and roles
npm run user:role -- you@example.com admin     # set a role (by email or user id)
```

`user:role` uses `DATABASE_URL` from your environment if it's set, and otherwise reads `.env`. It prints which database host it's using. To manage production users, run it with the production URL from Vercel:

```bash
DATABASE_URL="<production url>" npm run user:role -- you@example.com admin
```

## Tests

```bash
npm test             # or npm run test:watch
```

These are Vitest tests: integration tests for the API routes (`tests/api`) and unit tests for helpers (`tests/lib`). They run against the `anthem_test` database, which every test empties, so Postgres must be running (`npm run db:up`). The logged-in user is mocked; see `tests/helpers.ts` (`logInAs`, `logOut`).

**CI.** `.github/workflows/ci.yml` runs on every pull request and push to `main`, on GitHub Actions, so it doesn't use Vercel build minutes. It runs `npm ci`, `prisma generate`, lint, `tsc --noEmit`, `npm test` against a fresh Postgres 17 service container, and `npm run build`, on the Node version from `engines.node`.

## Production environment variables (Vercel)

The database is Neon. Set both URLs for the **Production** environment:

| Variable | Value | Used by |
|---|---|---|
| `DATABASE_URL` | Neon's **pooled** connection string (host contains `-pooler`) | The app |
| `DIRECT_URL` | Neon's **direct** connection string (same host without `-pooler`) | `prisma migrate deploy` during production builds |

Migrations need the direct connection, because the pooler runs in transaction mode and breaks Prisma's migration lock. A production build fails with a clear message if `DIRECT_URL` is missing. Previews don't run migrations, so they don't need it. Also set `NEXTAUTH_URL`, `NEXTAUTH_SECRET` and the OAuth credentials.

## Database changes

Edit `prisma/schema.prisma`, then run `npx prisma migrate dev --name <change>` and commit the new folder in `prisma/migrations`. Production deploys apply pending migrations (`scripts/vercel-build.sh`, the build command in `vercel.json`) over `DIRECT_URL`. Preview deploys don't, because they use the production database, so a PR's preview fails wherever it uses the new schema until the PR is merged.
