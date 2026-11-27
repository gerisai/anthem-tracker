import { describe, expect, it } from 'vitest';
import { addSong, removeSong, type ProgramsState } from '@/lib/useProgramSongs';

const a = { id: 'a', name: 'A' };
const b = { id: 'b', name: 'B' };

const empty = (): ProgramsState => ({
  recibimiento: { type: 'recibimiento', songs: [] },
  matutino: { type: 'matutino', songs: [] },
  vespertino: { type: 'vespertino', songs: [] },
});

describe('addSong', () => {
  it('adds the song to one section without changing the original', () => {
    const initial = empty();
    const snapshot = structuredClone(initial);

    const next = addSong(initial, 'matutino', a);

    expect(next.matutino.songs).toEqual([a]);
    expect(next.recibimiento.songs).toEqual([]);
    expect(initial).toEqual(snapshot);
  });

  it('returns new objects for the changed section only', () => {
    const initial = empty();

    const next = addSong(initial, 'matutino', a);

    expect(next).not.toBe(initial);
    expect(next.matutino).not.toBe(initial.matutino);
    expect(next.recibimiento).toBe(initial.recibimiento);
  });

  it('keeps other fields of the section, like the program id on edit', () => {
    const initial = { ...empty(), matutino: { id: 'p1', type: 'matutino', songs: [], order: {} } };

    expect(addSong(initial, 'matutino', a).matutino).toEqual({ id: 'p1', type: 'matutino', songs: [a], order: {} });
  });
});

describe('removeSong', () => {
  it('removes the song from one section without changing the original', () => {
    const initial = addSong(addSong(empty(), 'matutino', a), 'matutino', b);
    const snapshot = structuredClone(initial);

    const next = removeSong(initial, 'matutino', a);

    expect(next.matutino.songs).toEqual([b]);
    expect(initial).toEqual(snapshot);
  });
});
