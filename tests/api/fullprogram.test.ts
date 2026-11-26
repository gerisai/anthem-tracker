import { describe, expect, it } from 'vitest';
import { DELETE, POST, PUT } from '@/app/api/fullprogram/route';
import { prisma } from '@/lib/prisma';
import { createSongs, jsonRequest, logInAs, logOut, servicePayload, songDates } from '../helpers';

// Creates a service through the API and returns its FullProgram
async function createService(...args: Parameters<typeof servicePayload>) {
  const res = await POST(jsonRequest('POST', servicePayload(...args)));
  expect(res.status).toBe(200);
  return res.json();
}

describe('POST /api/fullprogram', () => {
  it('returns 401 when logged out', async () => {
    logOut();
    const [a] = await createSongs('A');

    const res = await POST(jsonRequest('POST', servicePayload('2026-03-01', { recibimiento: [a], matutino: [], vespertino: [] })));

    expect(res.status).toBe(401);
    expect(await prisma.fullProgram.count()).toBe(0);
    expect(await songDates(a)).toEqual([]);
  });

  it('returns 400 unless there is one program of each type', async () => {
    await logInAs();
    const payload = servicePayload('2026-03-01', { recibimiento: [], matutino: [], vespertino: [] });
    payload.programs.pop();

    const res = await POST(jsonRequest('POST', payload));

    expect(res.status).toBe(400);
    expect(await prisma.program.count()).toBe(0);
  });

  it('creates the service, its three programs and the song dates', async () => {
    const user = await logInAs();
    const [a, b] = await createSongs('A', 'B');

    const created = await createService('2026-03-01', { recibimiento: [a], matutino: [a, b], vespertino: [] });

    const fullProgram = await prisma.fullProgram.findUniqueOrThrow({
      where: { id: created.id },
      include: { programs: { include: { songs: true } } },
    });
    expect(fullProgram.userId).toBe(user.id);
    expect(fullProgram.isCurrent).toBe(true);
    expect(fullProgram.programs.map((p) => p.type).sort()).toEqual(['matutino', 'recibimiento', 'vespertino']);
    expect(fullProgram.programs.find((p) => p.type === 'matutino')!.order).toEqual({ A: 1, B: 2 });

    // A is in two programs on the same date, so it has the date twice
    expect(await songDates(a)).toEqual(['2026-03-01', '2026-03-01']);
    expect(await songDates(b)).toEqual(['2026-03-01']);
  });

  it('publishing unpublishes the previous service and its programs', async () => {
    await logInAs();
    const old = await createService('2026-03-01', { recibimiento: [], matutino: [], vespertino: [] });

    await createService('2026-03-08', { recibimiento: [], matutino: [], vespertino: [] });

    const oldFullProgram = await prisma.fullProgram.findUniqueOrThrow({ where: { id: old.id }, include: { programs: true } });
    expect(oldFullProgram.isCurrent).toBe(false);
    expect(oldFullProgram.programs.every((p) => !p.isCurrent)).toBe(true);
    expect(await prisma.fullProgram.count({ where: { isCurrent: true } })).toBe(1);
    expect(await prisma.program.count({ where: { isCurrent: true } })).toBe(3);
  });

  it('saves nothing when any write fails', async () => {
    await logInAs();
    const [a] = await createSongs('A');
    const payload = servicePayload('2026-03-01', { recibimiento: [a], matutino: [], vespertino: [] });
    payload.programs[2].songs.push({ id: 'missing-song' });

    await expect(POST(jsonRequest('POST', payload))).rejects.toThrow();

    expect(await prisma.fullProgram.count()).toBe(0);
    expect(await prisma.program.count()).toBe(0);
    expect(await songDates(a)).toEqual([]);
  });
});

describe('PUT /api/fullprogram', () => {
  it('moves song dates when songs are swapped and the date changes', async () => {
    await logInAs();
    const [kept, removed, added] = await createSongs('Kept', 'Removed', 'Added');
    const service = await createService('2026-03-01', { recibimiento: [kept, removed], matutino: [], vespertino: [] });

    const res = await PUT(jsonRequest('PUT', {
      id: service.id,
      ...servicePayload('2026-03-02', { recibimiento: [kept, added], matutino: [], vespertino: [] }),
    }));

    expect(res.status).toBe(200);
    expect(await songDates(kept)).toEqual(['2026-03-02']);
    expect(await songDates(removed)).toEqual([]);
    expect(await songDates(added)).toEqual(['2026-03-02']);

    const fullProgram = await prisma.fullProgram.findUniqueOrThrow({ where: { id: service.id }, include: { programs: true } });
    expect(fullProgram.date.toISOString().slice(0, 10)).toBe('2026-03-02');
    expect(fullProgram.programs.every((p) => p.date.toISOString().slice(0, 10) === '2026-03-02')).toBe(true);
  });

  it('removing a song from one of two programs on the same date keeps the other date', async () => {
    await logInAs();
    const [a] = await createSongs('A');
    const service = await createService('2026-03-01', { recibimiento: [a], matutino: [a], vespertino: [] });

    await PUT(jsonRequest('PUT', {
      id: service.id,
      ...servicePayload('2026-03-01', { recibimiento: [a], matutino: [], vespertino: [] }),
    }));

    expect(await songDates(a)).toEqual(['2026-03-01']);
  });

  it('unpublishing clears the flag on the service and its programs', async () => {
    await logInAs();
    const service = await createService('2026-03-01', { recibimiento: [], matutino: [], vespertino: [] });

    await PUT(jsonRequest('PUT', {
      id: service.id,
      ...servicePayload('2026-03-01', { recibimiento: [], matutino: [], vespertino: [] }, false),
    }));

    expect(await prisma.fullProgram.count({ where: { isCurrent: true } })).toBe(0);
    expect(await prisma.program.count({ where: { isCurrent: true } })).toBe(0);
  });

  it('publishing an older service unpublishes the current one', async () => {
    await logInAs();
    const older = await createService('2026-03-01', { recibimiento: [], matutino: [], vespertino: [] });
    const current = await createService('2026-03-08', { recibimiento: [], matutino: [], vespertino: [] });

    await PUT(jsonRequest('PUT', {
      id: older.id,
      ...servicePayload('2026-03-01', { recibimiento: [], matutino: [], vespertino: [] }, true),
    }));

    const [o, c] = await Promise.all([
      prisma.fullProgram.findUniqueOrThrow({ where: { id: older.id }, include: { programs: true } }),
      prisma.fullProgram.findUniqueOrThrow({ where: { id: current.id }, include: { programs: true } }),
    ]);
    expect(o.isCurrent).toBe(true);
    expect(o.programs.every((p) => p.isCurrent)).toBe(true);
    expect(c.isCurrent).toBe(false);
    expect(c.programs.every((p) => !p.isCurrent)).toBe(true);
  });

  it('returns 401 when logged out', async () => {
    await logInAs();
    const service = await createService('2026-03-01', { recibimiento: [], matutino: [], vespertino: [] });
    logOut();

    const res = await PUT(jsonRequest('PUT', {
      id: service.id,
      ...servicePayload('2026-03-02', { recibimiento: [], matutino: [], vespertino: [] }),
    }));

    expect(res.status).toBe(401);
    const fullProgram = await prisma.fullProgram.findUniqueOrThrow({ where: { id: service.id } });
    expect(fullProgram.date.toISOString().slice(0, 10)).toBe('2026-03-01');
  });
});

describe('DELETE /api/fullprogram', () => {
  it('deletes the service, its programs and their song dates only', async () => {
    await logInAs();
    const [a] = await createSongs('A');
    const keep = await createService('2026-03-01', { recibimiento: [a], matutino: [], vespertino: [] });
    const remove = await createService('2026-03-08', { recibimiento: [a], matutino: [a], vespertino: [] });

    const res = await DELETE(jsonRequest('DELETE', { id: remove.id }));

    expect(res.status).toBe(200);
    expect(await prisma.fullProgram.findUnique({ where: { id: remove.id } })).toBeNull();
    expect(await prisma.fullProgram.findUnique({ where: { id: keep.id } })).not.toBeNull();
    expect(await prisma.program.count()).toBe(3);
    expect(await songDates(a)).toEqual(['2026-03-01']);
  });

  it('returns 401 when logged out', async () => {
    await logInAs();
    const service = await createService('2026-03-01', { recibimiento: [], matutino: [], vespertino: [] });
    logOut();

    const res = await DELETE(jsonRequest('DELETE', { id: service.id }));

    expect(res.status).toBe(401);
    expect(await prisma.fullProgram.count()).toBe(1);
  });
});
