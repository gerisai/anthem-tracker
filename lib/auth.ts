import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Returns the logged in user, or null if there is no session or no matching user
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.name) {
    return null;
  }

  return prisma.user.findFirst({
    where: {
      name: session.user.name
    }
  });
}

export const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
