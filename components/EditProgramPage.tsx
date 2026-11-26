'use client'

import { 
  FormControl, FormLabel, Switch, Input, 
  Heading, Divider, Flex, Button,
  Tabs, TabPanels, TabPanel, TabList, Tab, useToast
} from '@chakra-ui/react'
import { BiSolidFileBlank, BiRevision } from "react-icons/bi";
import { SongList } from '@/components/SongList';
import { ProgramSongList } from '@/components/ProgramSongList';
import { useState } from 'react';
import { parseDateISO, toProgramInputs } from '@/lib/Utils';
import { useRouter } from 'next/navigation';

export function EditProgramPage({ songs, existingPrograms, fullProgramId }: { songs: any, existingPrograms: any, fullProgramId: string }) {
  const router = useRouter();
  const toast = useToast();
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

  const [programs, setPrograms]: [any,any] = useState(initialPrograms);
  const [isLoading, setIsLoading ] = useState(false);

  const addProgramSong = (program: string, song: any) => {
    programs[program].songs = [...programs[program].songs, song];
    const newPrograms = Object.assign({},programs);
    setPrograms(newPrograms);
  }

  const deleteProgramSong = (program: string, song: any) => {
    programs[program].songs = programs[program].songs.filter((s: any) => s.id !== song.id)
    const newPrograms = Object.assign({},programs);
    setPrograms(newPrograms);
  }

  const restorePrograms = () => {
    const newPrograms = Object.assign({},initialPrograms);
    setPrograms(newPrograms);
  }

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
      toast({ title: 'No se pudo guardar el programa', status: 'error' });
      return;
    }

    router.push('/programs/history?refresh=true');
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
            <ProgramSongList program={programs.recibimiento} programType='recibimiento' deleteProgramSong={deleteProgramSong}/>
          </Flex>
          <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
          <Heading>Matutino</Heading>
          <Divider size='lg'variant='dashed' mt={2} mb={6}/>
            <ProgramSongList program={programs.matutino} programType='matutino' deleteProgramSong={deleteProgramSong}/>
          </Flex>
          <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
          <Heading>Vespertino</Heading>
          <Divider size='lg'variant='dashed' mt={2} mb={6}/>
            <ProgramSongList program={programs.vespertino} programType='vespertino' deleteProgramSong={deleteProgramSong}/>
          </Flex>
          <form onSubmit={createProgram}>
          <Flex direction='column' alignItems="center" justify="center" mb={4}>
              <FormControl display='flex' alignItems='center' my={6} w='30%'>
                <Input defaultValue={existingDate} name='date' isRequired={true} variant='flushed' size="lg" type="date"/>
              </FormControl>
              <FormControl display='flex' alignItems='center' justifyContent='center' my={6}>
                <FormLabel htmlFor='isCurrent' mb='0'>
                  Publicar programa?
                </FormLabel>
              <Switch defaultChecked={existingPrograms[0].isCurrent} name='isCurrent' colorScheme='yellow' size='lg' id='isCurrent'/>
              </FormControl>
          </Flex>
          <Flex direction='row' alignItems="center" wrap="wrap" justify="center" mb={4}>
            <Button size='lg' colorScheme='green' mt={4} mx={2} leftIcon={<BiSolidFileBlank/>} isLoading={isLoading} type='submit'>Guardar</Button>
            <Button size='lg' colorScheme='yellow' mt={4} mx={2} leftIcon={<BiRevision/>} onClick={restorePrograms}>Restaurar</Button>
          </Flex>
          </form>
      </Flex>
  </Flex>
  )
}
