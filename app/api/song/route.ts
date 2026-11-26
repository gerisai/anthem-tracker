import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, unauthorized } from '@/lib/auth';

const SONG_TYPES = ['himno', 'salmo', 'canto'];

const badRequest = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function POST(req: Request) {
  if (!(await getCurrentUser())) {
    return unauthorized();
  }

  const data = await req.json();

  // Only accept the fields a user can set; id and dates are managed by the app
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const type = data.type;
  const number = typeof data.number === 'string' && data.number.trim() ? data.number.trim() : null;

  if (!name) {
    return badRequest('Song name is required');
  }

  if (!SONG_TYPES.includes(type)) {
    return badRequest(`Song type must be one of: ${SONG_TYPES.join(', ')}`);
  }

  const song = await prisma.song.create({
    data: {
      name,
      type,
      number
    }
  });

  return NextResponse.json(song);
}
