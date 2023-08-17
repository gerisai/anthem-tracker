'use client'

import { Tabs, TabPanels, TabPanel, TabList, Tab, FormControl, FormLabel, Switch, Input, Heading, Divider, Flex, Button } from '@chakra-ui/react'
import { BiSolidFileBlank, BiRevision } from "react-icons/bi";
import { SongList } from '@/components/SongList';
import { ProgramSongList } from '@/components/ProgramSongList';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const [programs, setPrograms]: [any,any] = useState(initialPrograms);
  const [isLoading, setIsLoading ] = useState(false);
  const fullProgram = {
    programs: new Array(0),
    date: ''
  }

  const addProgramSong = (program: string, song: any) => {
    programs[program].songs = [...programs[program].songs, song];
    let newPrograms = Object.assign({},programs);
    setPrograms(newPrograms);
  }

  const deleteProgramSong = (program: string, song: any) => {
    programs[program].songs = programs[program].songs.filter((s: any) => s.id !== song.id)
    let newPrograms = Object.assign({},programs);
    setPrograms(newPrograms);
  }

  const clearPrograms = () => {
    let newPrograms = Object.assign({},initialPrograms);
    setPrograms(newPrograms);
  }

  const createProgram = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    // Create individual programs
    for (let programType in programs) {

      const body = {
        ...programs[programType],
        date: formData.get('date'),
        isCurrent: formData.get('isCurrent') ? true : false
      };

      const res = await fetch('/api/program', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const createdProgram = await res.json();

      fullProgram.programs = [...fullProgram.programs, createdProgram.id]

    }

    // Create full program
    const body = {
      date: formData.get('date'),
      isCurrent: formData.get('isCurrent') ? true : false,
      programs: fullProgram.programs
    };

    const res = await fetch('/api/fullprogram', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await res.json();

    setIsLoading(false);

    router.push('/programs/history');
  }

  return (
    <Flex color='white' justify="start" align="start" w="100%"
    mx={8} px={8} py={8} direction="row"> 
    <Flex color='white' justify="center" align="center" w="50%"
    mx={8} px={8} py={8} direction="column" rounded={6}>
      <Tabs variant='soft-rounded' colorScheme='teal' size='lg'>
        <TabList>
          <Tab>Himnario General</Tab>
          <Tab>Salmos</Tab>
          <Tab>Cantos</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
              <SongList addProgramSong={addProgramSong} choosable={true} type='Himno' songs={songs}/>
          </TabPanel>
          <TabPanel>
              <SongList addProgramSong={addProgramSong} choosable={true} type='Salmo' songs={songs}/>
          </TabPanel>
          <TabPanel>
              <SongList addProgramSong={addProgramSong} choosable={true} type='Canto' songs={songs}/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
    <Flex color='white' alignItems="center" justify="center" w="50%"
    mx={8} px={8} direction="column">
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Recibimiento</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
          <ProgramSongList programSongs={programs.recibimiento.songs} program='recibimiento' deleteProgramSong={deleteProgramSong}/>
        </Flex>
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Matutino</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
          <ProgramSongList programSongs={programs.matutino.songs} program='matutino' deleteProgramSong={deleteProgramSong}/>
        </Flex>
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Vespertino</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
          <ProgramSongList programSongs={programs.vespertino.songs} program='vespertino' deleteProgramSong={deleteProgramSong}/>
        </Flex>
        <form onSubmit={createProgram}>
        <Flex direction='column' alignItems="center" justify="center" mb={4}>
            <FormControl display='flex' alignItems='center' my={6} w='30%'>
              <Input name='date' isRequired={true} variant='flushed' size="lg" type="date"/>
            </FormControl>
            <FormControl display='flex' alignItems='center' justifyContent='center' my={6}>
              <FormLabel htmlFor='isCurrent' mb='0'>
                Publicar programa?
              </FormLabel>
            <Switch name='isCurrent' colorScheme='yellow' size='lg' id='isCurrent'/>
            </FormControl>
        </Flex>
        <Flex direction='row' alignItems="center" wrap="wrap" justify="center" mb={4}>
          <Button size='lg' colorScheme='green' mt={4} mx={2} leftIcon={<BiSolidFileBlank/>} isLoading={isLoading} type='submit'>Guardar</Button>
          <Button size='lg' colorScheme='yellow' mt={4} mx={2} leftIcon={<BiRevision/>} onClick={clearPrograms}>Reiniciar</Button>
        </Flex>
        </form>
    </Flex>
  </Flex> 
  )
}
