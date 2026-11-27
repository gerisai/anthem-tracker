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

  // One entry per section, its songs in their saved order. The state keeps no
  // `order`: toProgramInputs rebuilds it from the song list on save.
  const initialPrograms: any = Object.fromEntries(
    ['recibimiento', 'matutino', 'vespertino'].map((type) => {
      const program = existingPrograms.find((p: any) => p.type === type);
      const order = program.order ?? {};
      const songs = [...program.songs].sort((a: any, b: any) => order[a.name] - order[b.name]);
      return [type, { id: program.id, type, songs }];
    })
  );

  const { programs, addProgramSong, moveProgramSong, deleteProgramSong, reset: restorePrograms } = useProgramSongs(initialPrograms);
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
    <ProgramEditor songs={songs} programs={programs} addProgramSong={addProgramSong} moveProgramSong={moveProgramSong} deleteProgramSong={deleteProgramSong}
    onSubmit={createProgram} onReset={restorePrograms} resetLabel='Restaurar' isLoading={isLoading}
    defaultDate={existingDate} defaultIsCurrent={existingPrograms[0].isCurrent}/>
  )
}
