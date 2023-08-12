import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const foundUser = await prisma.user.findFirst({
    where: {
      name: session?.user?.name!
    }
  });
  
  const data = await req.json();

  data.date = new Date(data.date);

  const program = await prisma.program.create({
    data: {
      type: data.type,
      date: data.date,
      author: {
        connect: {
          id: foundUser!.id
        }
      },
      isCurrent: data.isCurrent,
      songs: {
        connect: data.songs.map((song: any) => ({ id: song.id }))
      }
    }
  });

  data.songs.forEach(async (song: any) => {
    await prisma.song.update({
      where: {
        id: song.id
      },
      data: {
        dates: [...song.dates!, data.date]
      }
    });
  });

  return NextResponse.json(program);
}
