import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email!;

  const data = await req.json();

  const song = await prisma.song.create({ data });

  return NextResponse.json(song);
}