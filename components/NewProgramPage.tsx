'use client'

import { Heading, Divider, Highlight, Flex, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody } from '@chakra-ui/react'
import { BiPlus, BiSolidFileBlank, BiRevision } from "react-icons/bi";
import { SongList } from '@/components/SongList';
import { ProgramSongList } from '@/components/ProgramSongList';
import { useState } from 'react';

export function NewProgramPage({ songs }: { songs: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [programSongs, setProgramSongs] = useState(new Array(0));

  const addProgramSong = (program: string, name: string) => {
    setProgramSongs([{name, program}, ...programSongs].reverse());
    onClose();
  }

  const clearPrograms = () => {
    setProgramSongs([]);
  }

  return (
    <>
    <Flex color='white' alignItems="center" justify="center" w="80%"
    mx={8} px={8} direction="column">
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Recibimiento</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
          <ProgramSongList program='recibimiento' programSongs={programSongs}/>
        </Flex>
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Matutino</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
          <ProgramSongList program='matutino' programSongs={programSongs}/>
        </Flex>
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Vespertino</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
          <ProgramSongList program='vespertino' programSongs={programSongs}/>
        </Flex>
        <Flex direction='row' alignItems="center" justify="center" mb={4}>
          <Button size='lg' colorScheme='green' mt={4} mx={2} leftIcon={<BiSolidFileBlank/>}>Guardar</Button>
          <Button size='lg' colorScheme='blue' mt={4} mx={2} leftIcon={<BiPlus/>} onClick={onOpen}>Agregar</Button>
          <Button size='lg' colorScheme='yellow' mt={4} mx={2} leftIcon={<BiRevision/>} onClick={clearPrograms}>Reiniciar</Button>
        </Flex>
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
