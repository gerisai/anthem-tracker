'use client'

import { Flex, Heading, Separator, SimpleGrid } from '@chakra-ui/react';
import { ProgramRecord } from '@/components/ProgramRecord';
import { groupByMonth } from '@/lib/Utils';

export function HistoryPage({ programs }: { programs: any }) {
    const months = groupByMonth(programs);

    return (
    <Flex alignItems='center' justify='center' direction='column' w='100%'>
    {
        programs.length === 0 ? <Heading>No se han creado programas</Heading> : '' 
    }
    {
    months.map((month) => (
        <Flex key={month.key} alignItems="center" direction="column" my={2} w="100%">
        <Heading size={{ base: '2xl', md: '3xl' }}>{month.label}</Heading>
        <Separator size='lg' variant='dashed' w='100%' mt={2} mb={{ base: 3, md: 6 }}/>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={{ base: 3, md: 4 }} w="100%">
            {
            month.programs.map((mp: any) => (
                <ProgramRecord key={mp.id} program={mp}/>
            ))
            }
        </SimpleGrid>
        </Flex>
    ))
    }
    </Flex>
    )
}
