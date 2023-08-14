'use client'

import { Flex, Heading, Divider } from "@chakra-ui/react"
import { SongRecord } from '@/components/SongRecord'

const monthsToNames: any = {
    0: 'Enero',
    1: 'Febrero',
    2: 'Marzo',
    3: 'Abril',
    4: 'Mayo',
    5: 'Junio',
    6: 'Julio',
    7: 'Agosto',
    8: 'Septiembre',
    9: 'Octubre',
    10: 'Noviembre',
    11: 'Diciembre'
}

export function HistoryPage({ programs }: { programs: any }) {
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
                <SongRecord key={i} program={mp}/>
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