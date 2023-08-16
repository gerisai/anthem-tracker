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

  if (data.isCurrent) { // Update last current program to become old
    const oldProgram = await prisma.program.findFirst({
      where: {
        isCurrent: true,
        type: data.type
      }
    });


    if (oldProgram) {
      await prisma.program.update({
        where: {
          id: oldProgram!.id
        },
        data: {
          isCurrent: false
        }
      })
    }
  }

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

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const foundUser = await prisma.user.findFirst({
    where: {
      name: session?.user?.name!
    }
  });
  
  const data = await req.json();

  data.date = new Date(data.date);

  if (data.isCurrent) { // Update last current program to become old
    const oldProgram = await prisma.program.findFirst({
      where: {
        isCurrent: true,
        type: data.type
      }
    });


    if (oldProgram) {
      await prisma.program.update({
        where: {
          id: oldProgram!.id
        },
        data: {
          isCurrent: false
        }
      })
    }
  }

  await prisma.program.update({ // Delete all previous songs
    where: {
      id: data.id
    },
    data: {
      songs: {
        set: [],
      }
    }
  });

  const program = await prisma.program.update({ // Update with new songs
    where: {
      id: data.id
    },
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

  console.log(data)

  // Remove date from old songs
  for (let song of data.oldSongs) {
    console.log(`Deleting date: ${data.date} from song: ${song.id}`)
    await prisma.song.update({
      where: {
        id: song.id
      },
      data: {
        dates: song.dates.filter((d: any) => new Date(d).toISOString() !== data.date.toISOString())
      }
    });
  }

  // Updates songs with new dates
  for (let song of data.songs) {
    console.log(`Adding date: ${data.date} from song: ${song.id}`)
    console.log([...song.dates!, data.date])
    await prisma.song.update({
      where: {
        id: song.id
      },
      data: {
        dates: [...song.dates!, data.date]
      }
    });
  }

  return NextResponse.json(program);
}