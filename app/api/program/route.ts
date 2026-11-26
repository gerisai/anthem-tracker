import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, unauthorized } from '@/lib/auth';

// Adds the program date to each song's usage history
async function addSongDates(tx: Prisma.TransactionClient, songIds: string[], date: Date) {
  for (const id of songIds) {
    await tx.song.update({
      where: {
        id
      },
      data: {
        dates: { push: date }
      }
    });
  }
}

// Removes one occurrence of the program date from each song's usage history.
// Only one, because a song can be in several programs on the same date.
async function removeSongDates(tx: Prisma.TransactionClient, songIds: string[], date: Date) {
  for (const id of songIds) {
    const song = await tx.song.findUniqueOrThrow({
      where: {
        id
      }
    });

    const i = song.dates.findIndex((d) => d.getTime() === date.getTime());
    if (i === -1) {
      continue;
    }

    await tx.song.update({
      where: {
        id
      },
      data: {
        dates: song.dates.filter((_, j) => j !== i)
      }
    });
  }
}

export async function POST(req: Request) {
  const foundUser = await getCurrentUser();
  if (!foundUser) {
    return unauthorized();
  }

  const data = await req.json();

  data.date = new Date(data.date);
  const songIds: string[] = data.songs.map((song: any) => song.id);

  const program = await prisma.$transaction(async (tx) => {
    if (data.isCurrent) { // Update last current program to become old
      await tx.program.updateMany({
        where: {
          isCurrent: true,
          type: data.type
        },
        data: {
          isCurrent: false
        }
      });
    }

    const program = await tx.program.create({
      data: {
        type: data.type,
        date: data.date,
        author: {
          connect: {
            id: foundUser.id
          }
        },
        isCurrent: data.isCurrent,
        songs: {
          connect: songIds.map((id) => ({ id }))
        },
        order: data.order
      }
    });

    await addSongDates(tx, songIds, data.date);

    return program;
  });

  return NextResponse.json(program);
}

export async function PUT(req: Request) {
  const foundUser = await getCurrentUser();
  if (!foundUser) {
    return unauthorized();
  }

  const data = await req.json();

  data.date = new Date(data.date);
  const songIds: string[] = data.songs.map((song: any) => song.id);

  const program = await prisma.$transaction(async (tx) => {
    // Read the program as stored, so song dates are fixed up from the DB
    // rather than from the client's copy
    const oldProgram = await tx.program.findUniqueOrThrow({
      where: {
        id: data.id
      },
      include: {
        songs: true
      }
    });

    if (data.isCurrent) { // Update last current program to become old
      await tx.program.updateMany({
        where: {
          isCurrent: true,
          type: data.type
        },
        data: {
          isCurrent: false
        }
      });
    }

    const program = await tx.program.update({
      where: {
        id: data.id
      },
      data: {
        type: data.type,
        date: data.date,
        author: {
          connect: {
            id: foundUser.id
          }
        },
        isCurrent: data.isCurrent,
        songs: {
          set: songIds.map((id) => ({ id }))
        },
        order: data.order
      }
    });

    // Remove the old date from the old songs, then add the new date to the new songs.
    // This also covers the program date being changed.
    await removeSongDates(tx, oldProgram.songs.map((s) => s.id), oldProgram.date);
    await addSongDates(tx, songIds, data.date);

    return program;
  });

  return NextResponse.json(program);
}

export async function DELETE(req: Request) {
  if (!(await getCurrentUser())) {
    return unauthorized();
  }

  const data = await req.json();

  const program = await prisma.$transaction(async (tx) => {
    const program = await tx.program.delete({
      where: {
        id: data.id
      },
      include: {
        songs: true
      }
    });

    await removeSongDates(tx, program.songs.map((s) => s.id), program.date);

    return program;
  });

  return NextResponse.json(program);
}
