import { defineConfig } from 'prisma/config';

// Prisma 7 no longer reads .env on its own. Load it if it exists; variables
// already set in the environment win (CI, Vercel, tests/global-setup.ts).
try {
  process.loadEnvFile();
} catch {}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  // Only the CLI (migrate, db seed, studio) uses this. It needs a direct,
  // non-pooled connection: Neon's pooler runs in transaction mode, which breaks
  // migrate's session-level advisory lock. The app connects with DATABASE_URL
  // through the driver adapter in lib/prisma.ts. `?? ''` so `prisma generate`
  // works where no database is configured.
  datasource: {
    url: process.env.DIRECT_URL ?? '',
    // Only migrate dev needs it; `|| undefined` lets tests/global-setup.ts blank it
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL || undefined,
  },
});
