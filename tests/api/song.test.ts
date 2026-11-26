import { describe, expect, it } from 'vitest';
import { POST } from '@/app/api/song/route';
import { prisma } from '@/lib/prisma';
import { jsonRequest, logInAs, logOut } from '../helpers';

describe('POST /api/song', () => {
  it('returns 401 when logged out', async () => {
    logOut();

    const res = await POST(jsonRequest('POST', { name: 'Salmo 23', type: 'salmo' }));

    expect(res.status).toBe(401);
    expect(await prisma.song.count()).toBe(0);
  });

  it('returns 400 without a name', async () => {
    await logInAs();

    const res = await POST(jsonRequest('POST', { name: '   ', type: 'salmo' }));

    expect(res.status).toBe(400);
    expect(await prisma.song.count()).toBe(0);
  });

  it('returns 400 for an unknown type', async () => {
    await logInAs();

    const res = await POST(jsonRequest('POST', { name: 'Nuevo', type: 'foo' }));

    expect(res.status).toBe(400);
    expect(await prisma.song.count()).toBe(0);
  });

  it('saves only name, type and number', async () => {
    await logInAs();

    const res = await POST(jsonRequest('POST', {
      id: 'chosen-id',
      name: '  Salmo 23  ',
      type: 'salmo',
      number: '  ',
      dates: ['2020-01-01'],
    }));

    expect(res.status).toBe(200);
    const song = await prisma.song.findFirstOrThrow();
    expect(song.id).not.toBe('chosen-id');
    expect(song.name).toBe('Salmo 23');
    expect(song.type).toBe('salmo');
    expect(song.number).toBeNull();
    expect(song.dates).toEqual([]);
  });
});
