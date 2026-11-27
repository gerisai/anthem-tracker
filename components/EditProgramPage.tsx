'use client'

import { ProgramEditor } from '@/components/ProgramEditor';
import { toaster } from '@/components/ui/toaster';
import { useState } from 'react';
import { parseDateISO, toProgramInputs } from '@/lib/Utils';
import { useRouter } from 'next/navigation';
import { useProgramSongs } from '@/lib/useProgramSongs';

export function EditProgramPage({ songs, existingPrograms, fullProgramId }: { songs: any, existingPrograms: any, fullProgramId: string }) {
  const router = useRouter();
  const existingDate = parseDateISO(existingPrograms[0].date)

  const initialPrograms: any = {
    recibimiento: {
        id: existingPrograms.filter( (program : any) => program.type === 'recibimiento')[0].id,
        type: 'recibimiento',
        songs: existingPrograms.filter( (program : any) => program.type === 'recibimiento')[0].songs,
        order: existingPrograms.filter( (program : any) => program.type === 'recibimiento')[0].order,
    },
    matutino: {
        id: existingPrograms.filter( (program : any) => program.type === 'matutino')[0].id,
        type: 'matutino',
        songs: existingPrograms.filter( (program : any) => program.type === 'matutino')[0].songs,
        order: existingPrograms.filter( (program : any) => program.type === 'matutino')[0].order,
    },
    vespertino: {
        id: existingPrograms.filter( (program : any) => program.type === 'vespertino')[0].id,
        type: 'vespertino',
        songs: existingPrograms.filter( (program : any) => program.type === 'vespertino')[0].songs,
        order: existingPrograms.filter( (program : any) => program.type === 'vespertino')[0].order,
    },
  }

  const { programs, addProgramSong, deleteProgramSong, reset: restorePrograms } = useProgramSongs(initialPrograms);
  const [isLoading, setIsLoading ] = useState(false);

  const createProgram = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    // Update the full program and its programs in one request
    const body = {
      id: fullProgramId,
      date: formData.get('date'),
      isCurrent: formData.get('isCurrent') ? true : false,
      programs: toProgramInputs(programs)
    };

    const res = await fetch('/api/fullprogram', {
      method: 'PUT',
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
    <ProgramEditor songs={songs} programs={programs} addProgramSong={addProgramSong} deleteProgramSong={deleteProgramSong}
    onSubmit={createProgram} onReset={restorePrograms} resetLabel='Restaurar' isLoading={isLoading}
    defaultDate={existingDate} defaultIsCurrent={existingPrograms[0].isCurrent}/>
  )
}
