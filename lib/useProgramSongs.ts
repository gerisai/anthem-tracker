import { useState } from 'react';

// The songs picked for each section of a service, keyed by program type
export type ProgramsState = Record<string, { type: string, songs: any[] } & Record<string, any>>;

// Pure updates: they return new objects and never change `programs`, so React
// sees every change and the initial state stays intact for resetting
export const addSong = (programs: ProgramsState, type: string, song: any): ProgramsState => ({
  ...programs,
  [type]: { ...programs[type], songs: [...programs[type].songs, song] },
});

export const removeSong = (programs: ProgramsState, type: string, song: any): ProgramsState => ({
  ...programs,
  [type]: { ...programs[type], songs: programs[type].songs.filter((s) => s.id !== song.id) },
});

// State for the new and edit service pages. `reset` goes back to `initial`.
export function useProgramSongs(initial: ProgramsState) {
  const [initialPrograms] = useState(initial);
  const [programs, setPrograms] = useState(initial);

  return {
    programs,
    addProgramSong: (type: string, song: any) => setPrograms((p) => addSong(p, type, song)),
    deleteProgramSong: (type: string, song: any) => setPrograms((p) => removeSong(p, type, song)),
    reset: () => setPrograms(initialPrograms),
  };
}
