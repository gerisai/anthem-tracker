import { execSync } from 'node:child_process';
import { testDatabaseUrl } from './test-database';

// Runs once before all tests: brings the test database schema up to date
export default function setup() {
  const url = testDatabaseUrl();

  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: url, SHADOW_DATABASE_URL: url },
    stdio: 'pipe',
  });
}
