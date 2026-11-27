'use client'

import { Switch, Input, Flex, Button } from '@chakra-ui/react'
import { BiSolidFileBlank, BiRevision } from "react-icons/bi";
import { SongTabs } from '@/components/SongTabs';
import { ProgramSection } from '@/components/ProgramSection';
import { toaster } from '@/components/ui/toaster';
import { ProgramSongList } from '@/components/ProgramSongList';
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
    <Flex color='white' justify="start" align="start" w="100%"
    mx={8} px={8} py={8} direction="row">
      <Flex color='white' justify="center" align="center" w="50%"
      mx={8} px={8} py={8} direction="column" rounded={6}>
        <SongTabs songs={songs} addProgramSong={addProgramSong}/>
      </Flex>
      <Flex color='white' alignItems="center" justify="center" w="50%"
      mx={8} px={8} direction="column">
          <ProgramSection title='Recibimiento'>
            <ProgramSongList program={programs.recibimiento} programType='recibimiento' deleteProgramSong={deleteProgramSong}/>
          </ProgramSection>
          <ProgramSection title='Matutino'>
            <ProgramSongList program={programs.matutino} programType='matutino' deleteProgramSong={deleteProgramSong}/>
          </ProgramSection>
          <ProgramSection title='Vespertino'>
            <ProgramSongList program={programs.vespertino} programType='vespertino' deleteProgramSong={deleteProgramSong}/>
          </ProgramSection>
          <form onSubmit={createProgram}>
          <Flex direction='column' alignItems="center" justify="center" mb={4}>
            <Flex alignItems='center' my={6}>
              <Input defaultValue={existingDate} name='date' required variant='flushed' size="lg" type="date" w='auto'/>
            </Flex>
            <Switch.Root defaultChecked={existingPrograms[0].isCurrent} name='isCurrent' colorPalette='yellow' size='lg' my={6}>
              <Switch.HiddenInput/>
              <Switch.Label>Publicar programa?</Switch.Label>
              {/* The unchecked track defaults to gray.800, the page background */}
              <Switch.Control bg='gray.600' _checked={{ bg: 'colorPalette.solid' }}/>
            </Switch.Root>
          </Flex>
          <Flex direction='row' alignItems="center" wrap="wrap" justify="center" mb={4}>
            <Button size='lg' colorPalette='green' mt={4} mx={2} loading={isLoading} type='submit'><BiSolidFileBlank/> Guardar</Button>
            <Button size='lg' colorPalette='yellow' mt={4} mx={2} onClick={restorePrograms}><BiRevision/> Restaurar</Button>
          </Flex>
          </form>
      </Flex>
  </Flex>
  )
}
