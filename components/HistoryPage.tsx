'use client'

import { Flex, Heading, Divider } from '@chakra-ui/react';
import { ProgramRecord } from '@/components/ProgramRecord';
import { monthsToNames } from '@/lib/Utils';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export function HistoryPage({ programs }: { programs: any }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const shouldRefresh = searchParams.get('refresh');

    if (shouldRefresh) {
        router.refresh();
    }
    
    programs.sort((a: any, b: any) => {
        let da: any = new Date(a.date),
            db: any = new Date(b.date);
        return da - db;
    });

    const months: number[] = programs.map((p: any) => new Date(p.date).getMonth()).filter((x: any,i: any,a: any) => a.indexOf(x) === i);

    return (
    <Flex alignItems='center' justify='center' direction='column'>
    {
        programs.length === 0 ? <Heading color='white'>No se han creado programas</Heading> : '' 
    }
    {
    months.map( (month, i) => {
        const monthPrograms = programs.filter((p: any) => new Date(p.date).getMonth() === month);
        return (
        <Flex key={i} color='white' alignItems="center" justify="left" direction="column" m={2} p={2} rounded={6} w="100%">
        <Heading mx={4}>{monthsToNames[month]}</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
        <Flex wrap='wrap' color='white' alignItems="left" justify="left" direction="row" mx={2} w="100%">
            {
            monthPrograms.map((mp: any, i: number) => (
                <ProgramRecord key={i} program={mp}/>
            ))
            }
        </Flex>
        </Flex>
        )
    }
    )
    }
    </Flex>
    )
}