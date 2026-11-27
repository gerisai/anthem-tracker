import type { Prisma } from '@/generated/prisma/client';

export const PROGRAM_TYPES = ['recibimiento', 'matutino', 'vespertino'];

// One service section as sent by the client
export interface ProgramInput {
  id?: string;
  type: string;
  songs: { id: string }[];
  order: Prisma.InputJsonValue;
}

// Adds the program date to each song's usage history
export async function addSongDates(tx: Prisma.TransactionClient, songIds: string[], date: Date) {
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
export async function removeSongDates(tx: Prisma.TransactionClient, songIds: string[], date: Date) {
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

// Marks every current full program and program as old, except the given full program's
export async function clearCurrent(tx: Prisma.TransactionClient, exceptFullProgramId?: string) {
  await tx.fullProgram.updateMany({
    where: {
      isCurrent: true,
      ...(exceptFullProgramId && { id: { not: exceptFullProgramId } })
    },
    data: {
      isCurrent: false
    }
  });

  await tx.program.updateMany({
    where: {
      isCurrent: true,
      ...(exceptFullProgramId && { fullprogram: { none: { id: exceptFullProgramId } } })
    },
    data: {
      isCurrent: false
    }
  });
}
