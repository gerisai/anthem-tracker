'use client'

import { Heading, Divider, Highlight, Flex, Button, useDisclosure } from '@chakra-ui/react'
import { BiPlus, BiSolidFileBlank } from "react-icons/bi";
import { NewProgramSong } from '@/components/NewProgramSong'
import { useRef } from 'react'

export default function NewProgram() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  return (
    <Flex color='white' alignItems="center" justify="center" w="80%"
    mx={8} px={8} direction="column">
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Recibimiento</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
        <Button colorScheme='teal' ref={btnRef} onClick={onOpen}><BiPlus/></Button>
        <NewProgramSong isOpen={isOpen} onClose={onClose} btnRef={btnRef}/>
        </Flex>
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Matutino</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
        <Highlight query='1️⃣ 65 Salid valientes batallones' styles={{ px: '3', py: '1', rounded: 'full', bg: 'teal.100' }} >
            1️⃣ 65 Salid valientes batallones   
        </Highlight>
        </Flex>
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Vespertino</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
        <Highlight query='1️⃣ 65 Salid valientes batallones' styles={{ px: '3', py: '1', rounded: 'full', bg: 'teal.100' }} >
            1️⃣ 65 Salid valientes batallones   
        </Highlight>
        </Flex>
        <Button size='lg' colorScheme='green' mt={4} leftIcon={<BiSolidFileBlank/>}>Guardar</Button>
    </Flex>
  )
}
