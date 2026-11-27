import { execSync } from 'node:child_process';
import { testDatabaseUrl } from './test-database';

// Runs once before all tests: brings the test database schema up to date
export default function setup() {
  const url = testDatabaseUrl();

  execSync('npx prisma migrate deploy', {
    // Override every URL Prisma reads, or migrate would fall back to .env's dev
    // database. deploy doesn't use a shadow database, and Prisma 7 rejects one
    // that equals the main database, so blank it (prisma.config.ts skips it).
    env: { ...process.env, DATABASE_URL: url, DIRECT_URL: url, SHADOW_DATABASE_URL: '' },
    stdio: 'pipe',
  });
}
