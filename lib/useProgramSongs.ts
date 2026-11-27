import { useState } from 'react';

// The songs picked for each section of a service, keyed by program type
export type ProgramsState = Record<string, { type: string, songs: any[] } & Record<string, any>>;

// Pure updates: they return new objects and never change `programs`, so React
// sees every change and the initial state stays intact for resetting
// Inserts at `index` (0 = first), or at the end without one
export const addSong = (programs: ProgramsState, type: string, song: any, index?: number): ProgramsState => {
  const songs = [...programs[type].songs];
  songs.splice(index ?? songs.length, 0, song);
  return { ...programs, [type]: { ...programs[type], songs } };
};

export const removeSong = (programs: ProgramsState, type: string, song: any): ProgramsState => ({
  ...programs,
  [type]: { ...programs[type], songs: programs[type].songs.filter((s) => s.id !== song.id) },
});

// Moves a song from one section to `index` in another, or within the same
// section (then `index` is its position after the move, like arrayMove)
export const moveSong = (programs: ProgramsState, from: string, to: string, song: any, index: number): ProgramsState =>
  addSong(removeSong(programs, from, song), to, song, index);

// State for the new and edit service pages. `reset` goes back to `initial`.
export function useProgramSongs(initial: ProgramsState) {
  const [initialPrograms] = useState(initial);
  const [programs, setPrograms] = useState(initial);

  return {
    programs,
    addProgramSong: (type: string, song: any, index?: number) => setPrograms((p) => addSong(p, type, song, index)),
    moveProgramSong: (from: string, to: string, song: any, index: number) => setPrograms((p) => moveSong(p, from, to, song, index)),
    deleteProgramSong: (type: string, song: any) => setPrograms((p) => removeSong(p, type, song)),
    reset: () => setPrograms(initialPrograms),
  };
}
