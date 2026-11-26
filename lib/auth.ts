import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Returns the logged in user, or null if there is no session or no matching user
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  });
}

export const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

export const forbidden = () => NextResponse.json({ error: 'Forbidden' }, { status: 403 });

export const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404 });
