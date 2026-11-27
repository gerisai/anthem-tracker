'use client'

import { Flex, Heading, Separator } from '@chakra-ui/react';
import { ProgramRecord } from '@/components/ProgramRecord';
import { groupByMonth } from '@/lib/Utils';

export function HistoryPage({ programs }: { programs: any }) {
    const months = groupByMonth(programs);

    return (
    <Flex alignItems='center' justify='center' direction='column'>
    {
        programs.length === 0 ? <Heading color='white'>No se han creado programas</Heading> : '' 
    }
    {
    months.map((month) => (
        <Flex key={month.key} color='white' alignItems="center" justify="left" direction="column" m={2} p={2} rounded={6} w="100%">
        <Heading mx={4}>{month.label}</Heading>
        <Separator size='lg' variant='dashed' w='100%' mt={2} mb={6}/>
        <Flex wrap='wrap' color='white' alignItems="left" justify="left" direction="row" mx={2} w="100%">
            {
            month.programs.map((mp: any) => (
                <ProgramRecord key={mp.id} program={mp}/>
            ))
            }
        </Flex>
        </Flex>
    ))
    }
    </Flex>
    )
}
