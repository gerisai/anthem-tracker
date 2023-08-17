'use client'

import { Heading, Divider, Flex, Button, Link } from '@chakra-ui/react';
import { BiPlus, BiPencil, BiTrash } from "react-icons/bi";
import AuthCheck from '@/components/AuthCheck';
import { CurrentProgramSongList } from '@/components/CurrentProgramSongList';
import { parseDate } from '@/lib/Utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CurrentProgram({ programs, fullProgramId }: { programs: any, fullProgramId: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const deleteProgram = async () => {
        setIsLoading(true);

        // Delete individual programs
        for (let program of programs) {
        
            const res = await fetch('/api/program', {
            method: 'DELETE',
            body: JSON.stringify({ id: program.id, date: program.date, songs: program.songs }),
            headers: {
                'Content-Type': 'application/json',
            },
            });
          
            await res.json();
        }

        //Delete full program
        const res = await fetch('/api/fullprogram', {
            method: 'DELETE',
            body: JSON.stringify({ id: fullProgramId }),
            headers: {
                'Content-Type': 'application/json',
            },
            });
          
        await res.json();

        setIsLoading(false);
        router.push('/programs/history');
    }
    
    return (
        <Flex color='white' alignItems="center" justify="center" w="80%"
        mx={8} px={8} direction="column">
            <AuthCheck>
                { fullProgramId ?
                <>
                <Flex alignItems="right" direction="row" m={4} rounded={6} w="80%">
                    <Link href={`/programs/history/${fullProgramId}/edit`}><Button colorScheme='yellow' mr={2} leftIcon={<BiPencil/>}>Editar programa</Button></Link>
                    <Button isLoading={isLoading} colorScheme='red' mr={2} leftIcon={<BiTrash/>} onClick={deleteProgram}>Borrar programa</Button>
                </Flex>
                </>
                :
                <Flex alignItems="right" direction="row" m={4} rounded={6} w="80%">
                  <Link href='/programs/current/new'><Button colorScheme='green' mr={2} leftIcon={<BiPlus/>}>Crear programa</Button></Link>
                </Flex>
                }
            </AuthCheck>
            {
                programs.length === 0 ? 
                <Heading>No hay programas publicados</Heading>
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