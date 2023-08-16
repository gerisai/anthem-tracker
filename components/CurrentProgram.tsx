'use client'

import { Heading, Divider, Flex, Button, Link } from '@chakra-ui/react';
import { BiPlus, BiPencil } from "react-icons/bi";
import AuthCheck from '@/components/AuthCheck';
import { CurrentProgramSongList } from '@/components/CurrentProgramSongList';
import { parseDate } from '@/lib/Utils';

export function CurrentProgram({ programs, fullProgramId }: { programs: any, fullProgramId: string }) {
    return (
        <Flex color='white' alignItems="center" justify="center" w="80%"
        mx={8} px={8} direction="column">
            <AuthCheck>
                { fullProgramId ?
                <Flex alignItems="right" direction="row" m={4} rounded={6} w="80%">
                    <Link href={`/programs/history/${fullProgramId}/edit`}><Button colorScheme='yellow' mr={2} leftIcon={<BiPencil/>}>Editar programa</Button></Link>
                </Flex>
                :
                <Flex alignItems="right" direction="row" m={4} rounded={6} w="80%">
                  <Link href='/programs/current/new'><Button colorScheme='green' mr={2} leftIcon={<BiPlus/>}>Crear programa</Button></Link>
                </Flex>
                }
            </AuthCheck>
            {
                programs.length === 0 ? 
                <Heading>No hay programas</Heading>
                :
                <>
                <Heading>{ parseDate(programs[0].date) }</Heading>
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
                </>
            }
        </Flex>
    )
}