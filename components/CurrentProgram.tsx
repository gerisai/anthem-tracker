'use client'

import { Heading, Flex, Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import { BiPlus, BiPencil, BiTrash } from "react-icons/bi";
import AuthCheck from '@/components/AuthCheck';
import { CurrentProgramSongList } from '@/components/CurrentProgramSongList';
import { ProgramSection } from '@/components/ProgramSection';
import { toaster } from '@/components/ui/toaster';
import { parseDate } from '@/lib/Utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CurrentProgram({ programs, fullProgramId, author }: { programs: any, fullProgramId: string, author: any }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const deleteProgram = async () => {
        setIsLoading(true);

        // Delete the full program and its programs in one request
        const res = await fetch('/api/fullprogram', {
            method: 'DELETE',
            body: JSON.stringify({ id: fullProgramId }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        setIsLoading(false);

        if (!res.ok) {
            toaster.create({ title: 'No se pudo borrar el programa', type: 'error' });
            return;
        }

        router.push('/programs/history');
    }

    return (
        <Flex color='white' alignItems="center" justify="center" w="80%"
        mx={8} px={8} direction="column">
            { fullProgramId ?
            <AuthCheck ownerId={author.id}>
                <Flex alignItems="right" direction="row" m={4} rounded={6} w="80%">
                    <Button asChild colorPalette='yellow' mr={2}><NextLink href={`/programs/history/${fullProgramId}/edit`}><BiPencil/> Editar programa</NextLink></Button>
                    <Button loading={isLoading} colorPalette='red' mr={2} onClick={deleteProgram}><BiTrash/> Borrar programa</Button>
                </Flex>
            </AuthCheck>
            :
            <AuthCheck editor>
                <Flex alignItems="right" direction="row" m={4} rounded={6} w="80%">
                    <Button asChild colorPalette='green' mr={2}><NextLink href='/programs/current/new'><BiPlus/> Crear programa</NextLink></Button>
                </Flex>
            </AuthCheck>
            }
            {
                programs.length === 0 ?
                <Heading>No hay programas publicados</Heading>
                :
                <>
                <Heading>{ parseDate(programs[0].date) }</Heading>
                <Heading size='md'>Por: {  author.name }</Heading>
                <ProgramSection title='Recibimiento'>
                    <CurrentProgramSongList program={programs.filter((program: any) => program.type === 'recibimiento')[0]}/>
                </ProgramSection>
                <ProgramSection title='Matutino'>
                    <CurrentProgramSongList program={programs.filter((program: any) => program.type === 'matutino')[0]}/>
                </ProgramSection>
                <ProgramSection title='Vespertino'>
                    <CurrentProgramSongList program={programs.filter((program: any) => program.type === 'vespertino')[0]}/>
                </ProgramSection>
                </>
            }
        </Flex>
    )
}
