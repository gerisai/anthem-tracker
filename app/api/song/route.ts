import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, unauthorized } from '@/lib/auth';

export async function POST(req: Request) {
  if (!(await getCurrentUser())) {
    return unauthorized();
  }

  const data = await req.json();

  const song = await prisma.song.create({ data });

  return NextResponse.json(song);
}