import { afterAll, beforeEach, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { resetDatabase } from './helpers';

// Route handlers get the user from getCurrentUser(); tests set it with logInAs()/logOut()
vi.mock('@/lib/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth')>()),
  getCurrentUser: vi.fn(),
}));

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});
