'use client'

import { Heading, Divider, Flex, Button, Link } from '@chakra-ui/react';
import { BiPlus } from "react-icons/bi";
import AuthCheck from '@/components/AuthCheck';
import  { CurrentProgramSongList } from '@/components/CurrentProgramSongList';

export function CurrentProgram({ programs, historic }: { programs: any, historic: boolean }) {
    return (
        <Flex color='white' alignItems="center" justify="center" w="80%"
        mx={8} px={8} direction="column">
            <AuthCheck>
                { historic ? '' : 
                <Flex alignItems="right" direction="row" m={4} rounded={6} w="80%">
                  <Link href='/programs/current/new'><Button colorScheme='green' mr={2} leftIcon={<BiPlus/>}>Crear programa</Button></Link>
                </Flex>
                }
            </AuthCheck>
            <Heading>{programs.length !== 0 ? programs[0].date.toLocaleDateString('es-MX',{ year: 'numeric', month: 'numeric' ,day: 'numeric'}) : 'No hay programa'}</Heading>
            <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
            <Heading>Recibimiento</Heading>
            <Divider size='lg'variant='dashed' mt={2} mb={6}/>
                <CurrentProgramSongList programSongs={programs.filter((program: any) => program.type === 'recibimiento')[0].songs}/>
            </Flex>
            <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
            <Heading>Matutino</Heading>
            <Divider size='lg'variant='dashed' mt={2} mb={6}/>
                <CurrentProgramSongList programSongs={programs.filter((program: any) => program.type === 'matutino')[0].songs}/>
            </Flex>
            <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
            <Heading>Vespertino</Heading>
            <Divider size='lg'variant='dashed' mt={2} mb={6}/>
                <CurrentProgramSongList programSongs={programs.filter((program: any) => program.type === 'vespertino')[0].songs}/>
            </Flex>
        </Flex>
    )
}