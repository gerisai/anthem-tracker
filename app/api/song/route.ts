import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const data = await req.json();

  const song = await prisma.song.create({ data });

  return NextResponse.json(song);
}