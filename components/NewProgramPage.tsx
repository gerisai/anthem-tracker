'use client'

import { Switch, Input, Flex, Button } from '@chakra-ui/react'
import { BiSolidFileBlank, BiRevision } from "react-icons/bi";
import { SongTabs } from '@/components/SongTabs';
import { ProgramSection } from '@/components/ProgramSection';
import { toaster } from '@/components/ui/toaster';
import { ProgramSongList } from '@/components/ProgramSongList';
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
  const { programs, addProgramSong, deleteProgramSong, reset: clearPrograms } = useProgramSongs(initialPrograms);
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
    <Flex justify="start" align="start" w="100%"
    mx={8} px={8} py={8} direction="row">
    <Flex justify="center" align="center" w="50%"
    mx={8} px={8} py={8} direction="column" rounded={6}>
      <SongTabs songs={songs} addProgramSong={addProgramSong}/>
    </Flex>
    <Flex alignItems="center" justify="center" w="50%"
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
              <Input name='date' required variant='flushed' size="lg" type="date" w='auto'/>
            </Flex>
            <Switch.Root name='isCurrent' colorPalette='yellow' size='lg' my={6}>
              <Switch.HiddenInput/>
              <Switch.Label>Publicar programa?</Switch.Label>
              {/* The unchecked track defaults to the dark page background */}
              <Switch.Control bg='surface.track' _checked={{ bg: 'colorPalette.solid' }}/>
            </Switch.Root>
        </Flex>
        <Flex direction='row' alignItems="center" wrap="wrap" justify="center" mb={4}>
          <Button size='lg' colorPalette='green' mt={4} mx={2} loading={isLoading} type='submit'><BiSolidFileBlank/> Guardar</Button>
          <Button size='lg' colorPalette='yellow' mt={4} mx={2} onClick={clearPrograms}><BiRevision/> Reiniciar</Button>
        </Flex>
        </form>
    </Flex>
  </Flex> 
  )
}
