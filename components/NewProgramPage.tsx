'use client'

import { ProgramEditor } from '@/components/ProgramEditor';
import { toaster } from '@/components/ui/toaster';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toProgramInputs } from '@/lib/Utils';
import { useProgramSongs } from '@/lib/useProgramSongs';

const initialPrograms: any = {
  recibimiento: {
    type: 'recibimiento',
    songs: []
  },
  matutino: {
    type: 'matutino',
    songs: []
  },
  vespertino: {
    type: 'vespertino',
    songs: []
  },
}

export function NewProgramPage({ songs }: { songs: any }) {
  const router = useRouter();
  const { programs, addProgramSong, moveProgramSong, deleteProgramSong, reset: clearPrograms } = useProgramSongs(initialPrograms);
  const [isLoading, setIsLoading ] = useState(false);

  const createProgram = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    // Create the full program and its programs in one request
    const body = {
      date: formData.get('date'),
      isCurrent: formData.get('isCurrent') ? true : false,
      programs: toProgramInputs(programs)
    };

    const res = await fetch('/api/fullprogram', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setIsLoading(false);

    if (!res.ok) {
      toaster.create({ title: 'No se pudo guardar el programa', type: 'error' });
      return;
    }

    router.push('/programs/history');
  }

  return (
    <ProgramEditor songs={songs} programs={programs} addProgramSong={addProgramSong} moveProgramSong={moveProgramSong} deleteProgramSong={deleteProgramSong}
    onSubmit={createProgram} onReset={clearPrograms} resetLabel='Reiniciar' isLoading={isLoading}/>
  )
}
