'use client'

import { FormControl, FormLabel, Switch, Input, Heading, Divider, Flex, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody } from '@chakra-ui/react'
import { BiPlus, BiSolidFileBlank, BiRevision } from "react-icons/bi";
import { SongList } from '@/components/SongList';
import { ProgramSongList } from '@/components/ProgramSongList';
import { useState } from 'react';

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [programs, setPrograms]: [any,any] = useState(initialPrograms);
  const [isLoading, setIsLoading ] = useState(false);

  const addProgramSong = (program: string, song: any) => {
    programs[program].songs = [...programs[program].songs, song];
    
    setPrograms(programs)
    onClose();
  }

  const clearPrograms = () => {
    setPrograms(initialPrograms);
  }

  const createProgram = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    for (let programType in programs) {

      const body = {
        ...programs[programType],
        date: formData.get('date'),
        isCurrent: formData.get('isCurrent') ? true : false
      };

      console.log(body)

      const res = await fetch('/api/program', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      await res.json();

    }

    setIsLoading(false);
  }

  return (
    <>
    <Flex color='white' alignItems="center" justify="center" w="80%"
    mx={8} px={8} direction="column">
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Recibimiento</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
          <ProgramSongList programSongs={programs.recibimiento.songs}/>
        </Flex>
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Matutino</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
          <ProgramSongList programSongs={programs.matutino.songs}/>
        </Flex>
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Vespertino</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
          <ProgramSongList programSongs={programs.vespertino.songs}/>
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
          <Button size='lg' colorScheme='blue' mt={4} mx={2} leftIcon={<BiPlus/>} onClick={onOpen}>Agregar</Button>
          <Button size='lg' colorScheme='yellow' mt={4} mx={2} leftIcon={<BiRevision/>} onClick={clearPrograms}>Reiniciar</Button>
        </Flex>
        </form>
    </Flex>
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="outside">
    <ModalOverlay />
    <ModalContent color="white" background="gray.700">
      <ModalCloseButton />
      <ModalBody>
        <Flex direction='column' w="100%" m={4}>
          <SongList addProgramSong={addProgramSong} choosable={true} type="Himno" songs={songs}/>
          <SongList addProgramSong={addProgramSong} choosable={true} type="Salmo" songs={songs}/>
          <SongList addProgramSong={addProgramSong} choosable={true} type="Canto" songs={songs}/>
        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
  </>
  )
}
