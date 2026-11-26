import { describe, expect, it } from 'vitest';
import { DELETE, POST, PUT } from '@/app/api/fullprogram/route';
import { POST as createSong } from '@/app/api/song/route';
import { prisma } from '@/lib/prisma';
import { canCreate, canModify } from '@/lib/permissions';
import { jsonRequest, logInAs, servicePayload } from '../helpers';

const empty = { recibimiento: [], matutino: [], vespertino: [] };

// Creates a service owned by a fresh editor, then returns its id
async function serviceOwnedBy(name: string) {
  await logInAs(name, 'editor');
  const res = await POST(jsonRequest('POST', servicePayload('2026-03-01', empty)));
  expect(res.status).toBe(200);
  return (await res.json()).id as string;
}

const edit = (id: string) =>
  PUT(jsonRequest('PUT', { id, ...servicePayload('2026-03-02', empty) }));

const remove = (id: string) => DELETE(jsonRequest('DELETE', { id }));

const serviceDate = async (id: string) =>
  (await prisma.fullProgram.findUniqueOrThrow({ where: { id } })).date.toISOString().slice(0, 10);

describe('permission rules', () => {
  const viewer = { id: 'v', role: 'viewer' as const };
  const editor = { id: 'e', role: 'editor' as const };
  const admin = { id: 'a', role: 'admin' as const };

  it('only editors and admins can create', () => {
    expect([null, viewer, editor, admin].map((u) => canCreate(u))).toEqual([false, false, true, true]);
  });

  it('editors modify their own services, admins any', () => {
    expect(canModify(viewer, 'v')).toBe(false);
    expect(canModify(editor, 'e')).toBe(true);
    expect(canModify(editor, 'someone-else')).toBe(false);
    expect(canModify(admin, 'someone-else')).toBe(true);
    expect(canModify(null, 'e')).toBe(false);
  });
});

describe('viewers', () => {
  it('cannot create services or songs', async () => {
    await logInAs('Viewer', 'viewer');

    expect((await POST(jsonRequest('POST', servicePayload('2026-03-01', empty)))).status).toBe(403);
    expect((await createSong(jsonRequest('POST', { name: 'Nuevo', type: 'canto' }))).status).toBe(403);
    expect(await prisma.fullProgram.count()).toBe(0);
    expect(await prisma.song.count()).toBe(0);
  });

  it('cannot edit or delete services', async () => {
    const id = await serviceOwnedBy('Owner');
    await logInAs('Viewer', 'viewer');

    expect((await edit(id)).status).toBe(403);
    expect((await remove(id)).status).toBe(403);
    expect(await serviceDate(id)).toBe('2026-03-01');
  });
});

describe('editors', () => {
  it('can edit and delete their own services', async () => {
    const id = await serviceOwnedBy('Owner');

    expect((await edit(id)).status).toBe(200);
    expect(await serviceDate(id)).toBe('2026-03-02');
    expect((await remove(id)).status).toBe(200);
    expect(await prisma.fullProgram.count()).toBe(0);
  });

  it("cannot edit or delete someone else's service", async () => {
    const id = await serviceOwnedBy('Owner');
    await logInAs('Other Editor', 'editor');

    expect((await edit(id)).status).toBe(403);
    expect((await remove(id)).status).toBe(403);
    expect(await serviceDate(id)).toBe('2026-03-01');
  });
});

describe('admins', () => {
  it("can edit and delete anyone's service, keeping the original author", async () => {
    const id = await serviceOwnedBy('Owner');
    const owner = await prisma.user.findFirstOrThrow({ where: { name: 'Owner' } });
    await logInAs('Admin', 'admin');

    expect((await edit(id)).status).toBe(200);
    const edited = await prisma.fullProgram.findUniqueOrThrow({ where: { id }, include: { programs: true } });
    expect(edited.userId).toBe(owner.id);
    expect(edited.programs.every((p) => p.userId === owner.id)).toBe(true);

    expect((await remove(id)).status).toBe(200);
    expect(await prisma.fullProgram.count()).toBe(0);
  });
});

describe('missing services', () => {
  it('return 404 on edit and delete', async () => {
    await logInAs('Admin', 'admin');

    expect((await edit('does-not-exist')).status).toBe(404);
    expect((await remove('does-not-exist')).status).toBe(404);
  });
});
