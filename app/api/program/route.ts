import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  const data = await req.json();

  data.user = session?.user?.name!;
  data.date = new Date(data.date);

  const program = await prisma.program.create({ data });

  return NextResponse.json(program);
}
