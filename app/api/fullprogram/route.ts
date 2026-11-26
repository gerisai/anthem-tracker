import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { User } from '@prisma/client';
import { getCurrentUser, unauthorized, forbidden, notFound } from '@/lib/auth';
import { canCreate, canModify } from '@/lib/permissions';
import { PROGRAM_TYPES, ProgramInput, addSongDates, removeSongDates, clearCurrent } from '@/lib/programs';

const songIdsOf = (program: { songs: { id: string }[] }) => program.songs.map((s) => s.id);

// A full program must have exactly one program of each type
const hasAllTypes = (programs: ProgramInput[]) =>
  Array.isArray(programs) &&
  programs.length === PROGRAM_TYPES.length &&
  PROGRAM_TYPES.every((type) => programs.some((p) => p.type === type));

const badRequest = (error: string) => NextResponse.json({ error }, { status: 400 });

// Returns an error response unless the user may edit or delete the service
async function checkCanModify(user: User, id: unknown) {
  if (typeof id !== 'string') {
    return badRequest('Missing service id');
  }

  const existing = await prisma.fullProgram.findUnique({
    where: {
      id
    },
    select: {
      userId: true
    }
  });

  if (!existing) {
    return notFound();
  }
  if (!canModify(user, existing.userId)) {
    return forbidden();
  }

  return null;
}

// Creates a full program and its three programs in one transaction
export async function POST(req: Request) {
  const foundUser = await getCurrentUser();
  if (!foundUser) {
    return unauthorized();
  }
  if (!canCreate(foundUser)) {
    return forbidden();
  }

  const data = await req.json();
  const programs: ProgramInput[] = data.programs;

  if (!hasAllTypes(programs)) {
    return badRequest(`Expected one program of each type: ${PROGRAM_TYPES.join(', ')}`);
  }

  const date = new Date(data.date);
  const isCurrent = Boolean(data.isCurrent);

  const fullProgram = await prisma.$transaction(async (tx) => {
    if (isCurrent) { // Update last current programs to become old
      await clearCurrent(tx);
    }

    const programIds: string[] = [];

    for (const p of programs) {
      const program = await tx.program.create({
        data: {
          type: p.type,
          date,
          author: {
            connect: {
              id: foundUser.id
            }
          },
          isCurrent,
          songs: {
            connect: songIdsOf(p).map((id) => ({ id }))
          },
          order: p.order
        }
      });

      await addSongDates(tx, songIdsOf(p), date);
      programIds.push(program.id);
    }

    return tx.fullProgram.create({
      data: {
        date,
        author: {
          connect: {
            id: foundUser.id
          }
        },
        isCurrent,
        programs: {
          connect: programIds.map((id) => ({ id }))
        }
      }
    });
  });

  return NextResponse.json(fullProgram);
}

// Updates a full program and its three programs in one transaction
export async function PUT(req: Request) {
  const foundUser = await getCurrentUser();
  if (!foundUser) {
    return unauthorized();
  }

  const data = await req.json();

  const denied = await checkCanModify(foundUser, data.id);
  if (denied) {
    return denied;
  }

  const programs: ProgramInput[] = data.programs;

  if (!hasAllTypes(programs)) {
    return badRequest(`Expected one program of each type: ${PROGRAM_TYPES.join(', ')}`);
  }

  const date = new Date(data.date);
  const isCurrent = Boolean(data.isCurrent);

  const fullProgram = await prisma.$transaction(async (tx) => {
    // Read the programs as stored, so song dates are fixed up from the DB
    // rather than from the client's copy
    const oldFullProgram = await tx.fullProgram.findUniqueOrThrow({
      where: {
        id: data.id
      },
      include: {
        programs: {
          include: {
            songs: true
          }
        }
      }
    });

    if (isCurrent) { // Update last current programs to become old
      await clearCurrent(tx, oldFullProgram.id);
    }

    for (const oldProgram of oldFullProgram.programs) {
      const p = programs.find((p) => p.type === oldProgram.type);
      if (!p) {
        continue;
      }

      await tx.program.update({
        where: {
          id: oldProgram.id
        },
        data: {
          date,
          isCurrent,
          songs: {
            set: songIdsOf(p).map((id) => ({ id }))
          },
          order: p.order
        }
      });

      // Remove the old date from the old songs, then add the new date to the new songs.
      // This also covers the program date being changed.
      await removeSongDates(tx, songIdsOf(oldProgram), oldProgram.date);
      await addSongDates(tx, songIdsOf(p), date);
    }

    return tx.fullProgram.update({
      where: {
        id: oldFullProgram.id
      },
      data: {
        date,
        isCurrent
      }
    });
  });

  return NextResponse.json(fullProgram);
}

// Deletes a full program and its programs in one transaction
export async function DELETE(req: Request) {
  const foundUser = await getCurrentUser();
  if (!foundUser) {
    return unauthorized();
  }

  const data = await req.json();

  const denied = await checkCanModify(foundUser, data.id);
  if (denied) {
    return denied;
  }

  const fullProgram = await prisma.$transaction(async (tx) => {
    const fullProgram = await tx.fullProgram.findUniqueOrThrow({
      where: {
        id: data.id
      },
      include: {
        programs: {
          include: {
            songs: true
          }
        }
      }
    });

    for (const program of fullProgram.programs) {
      await removeSongDates(tx, songIdsOf(program), program.date);
    }

    await tx.program.deleteMany({
      where: {
        id: { in: fullProgram.programs.map((p) => p.id) }
      }
    });

    return tx.fullProgram.delete({
      where: {
        id: fullProgram.id
      }
    });
  });

  return NextResponse.json(fullProgram);
}
