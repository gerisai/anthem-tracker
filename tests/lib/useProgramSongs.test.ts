import { describe, expect, it } from 'vitest';
import { addSong, moveSong, removeSong, type ProgramsState } from '@/lib/useProgramSongs';

const a = { id: 'a', name: 'A' };
const b = { id: 'b', name: 'B' };
const c = { id: 'c', name: 'C' };

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

describe('addSong at an index', () => {
  it('inserts before the song at that index', () => {
    const initial = addSong(addSong(empty(), 'matutino', a), 'matutino', b);

    expect(addSong(initial, 'matutino', c, 0).matutino.songs).toEqual([c, a, b]);
    expect(addSong(initial, 'matutino', c, 1).matutino.songs).toEqual([a, c, b]);
  });
});

describe('moveSong', () => {
  const abc = () => addSong(addSong(addSong(empty(), 'matutino', a), 'matutino', b), 'matutino', c);

  it('reorders within a section, like arrayMove', () => {
    expect(moveSong(abc(), 'matutino', 'matutino', a, 2).matutino.songs).toEqual([b, c, a]);
    expect(moveSong(abc(), 'matutino', 'matutino', c, 0).matutino.songs).toEqual([c, a, b]);
  });

  it('moves a song to another section at an index without changing the original', () => {
    const initial = addSong(abc(), 'vespertino', a);
    const snapshot = structuredClone(initial);

    const next = moveSong(initial, 'matutino', 'vespertino', b, 0);

    expect(next.matutino.songs).toEqual([a, c]);
    expect(next.vespertino.songs).toEqual([b, a]);
    expect(initial).toEqual(snapshot);
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
