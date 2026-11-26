import { vi } from 'vitest';
import type { Role, Song } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Empties every app table (keeps Prisma's migration history)
export async function resetDatabase() {
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
  `;

  await prisma.$executeRawUnsafe(
    `TRUNCATE ${tables.map((t) => `"${t.tablename}"`).join(', ')} CASCADE`
  );
}

export async function logInAs(name = 'Test User', role: Role = 'editor') {
  const user = await prisma.user.create({
    data: { name, role, email: `${name.toLowerCase().replace(/\s+/g, '.')}@test.local` },
  });

  vi.mocked(getCurrentUser).mockResolvedValue(user);
  return user;
}

export function logOut() {
  vi.mocked(getCurrentUser).mockResolvedValue(null);
}

export function createSongs(...names: string[]) {
  return Promise.all(
    names.map((name) => prisma.song.create({ data: { name, type: 'canto', dates: [] } }))
  );
}

export function jsonRequest(method: string, body: unknown) {
  return new Request('http://localhost/api', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

type Sections = { recibimiento: Song[]; matutino: Song[]; vespertino: Song[] };

// Builds a /api/fullprogram payload the way the pages do (see toProgramInputs)
export function servicePayload(date: string, sections: Sections, isCurrent = true) {
  return {
    date,
    isCurrent,
    programs: Object.entries(sections).map(([type, songs]) => ({
      type,
      songs: songs.map((s) => ({ id: s.id })),
      order: Object.fromEntries(songs.map((s, i) => [s.name, i + 1])),
    })),
  };
}

// Song.dates as YYYY-MM-DD strings, sorted, for easy assertions
export async function songDates(song: Song) {
  const { dates } = await prisma.song.findUniqueOrThrow({ where: { id: song.id } });
  return dates.map((d) => d.toISOString().slice(0, 10)).sort();
}
