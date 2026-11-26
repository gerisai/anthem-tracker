import { testDatabaseUrl } from './test-database';

// Runs before tests/setup.ts (see vitest.config.mts), so the app's Prisma client
// is created against the test database
process.env.DATABASE_URL = testDatabaseUrl();
