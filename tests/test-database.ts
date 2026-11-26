// Resolves the test database URL from .env, refusing anything that isn't local
export function testDatabaseUrl() {
  try {
    process.loadEnvFile('.env');
  } catch {
    // No .env file: rely on the environment
  }

  const value = process.env.TEST_DATABASE_URL;
  if (!value) {
    throw new Error('TEST_DATABASE_URL is not set. Copy .env.example to .env and run npm run db:up.');
  }

  const url = new URL(value);
  if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    throw new Error(`Refusing to run tests: TEST_DATABASE_URL points to ${url.hostname}, not a local database.`);
  }

  return value;
}
