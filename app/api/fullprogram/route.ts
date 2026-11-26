import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, unauthorized } from '@/lib/auth';

export async function POST(req: Request) {
  const foundUser = await getCurrentUser();
  if (!foundUser) {
    return unauthorized();
  }

  const data = await req.json();

  data.date = new Date(data.date);

  const fullProgram = await prisma.$transaction(async (tx) => {
    if (data.isCurrent) { // Update last current full program to become old
      await tx.fullProgram.updateMany({
        where: {
          isCurrent: true
        },
        data: {
          isCurrent: false
        }
      });
    }

    return tx.fullProgram.create({
      data: {
        date: data.date,
        author: {
          connect: {
            id: foundUser.id
          }
        },
        isCurrent: data.isCurrent,
        programs: {
          connect: data.programs.map((program: any) => ({ id: program }))
        }
      }
    });
  });

  return NextResponse.json(fullProgram);
}

export async function DELETE(req: Request) {
  if (!(await getCurrentUser())) {
    return unauthorized();
  }

  const data = await req.json();

  const fullProgram = await prisma.fullProgram.delete({
    where: {
      id: data.id
    }
  });

  return NextResponse.json(fullProgram);
}