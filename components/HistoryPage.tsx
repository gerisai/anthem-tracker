'use client'

import { Accordion, Badge, Flex, Heading, HStack, SimpleGrid, Text } from '@chakra-ui/react';
import { ProgramRecord } from '@/components/ProgramRecord';
import { groupByYear } from '@/lib/Utils';

const countLabel = (n: number) => `${n} ${n === 1 ? 'programa' : 'programas'}`;

// All services grouped by year (newest first), then month (January first).
// Years and months are expandable sections; only the latest year and its
// latest month start open.
// Trigger labels are spans: a button may only hold inline content (no headings).
// lazyMount: a closed section renders its cards the first time it opens.
export function HistoryPage({ programs }: { programs: any }) {
    const years = groupByYear<any>(programs);

    if (years.length === 0) {
        return <Heading size={{ base: '2xl', md: '3xl' }} textAlign='center'>No se han creado programas</Heading>;
    }

    return (
    <Accordion.Root multiple lazyMount defaultValue={[String(years[0].year)]} variant='plain' w='100%'>
    <Flex direction='column' gap={{ base: 3, md: 4 }} w='100%'>
    {
    years.map((year, y) => (
        <Accordion.Item key={year.year} value={String(year.year)} bg='surface' rounded='lg' shadow='sm'>
            <Accordion.ItemTrigger px={{ base: 4, md: 6 }} py={{ base: 3, md: 4 }} cursor='pointer'>
                <HStack as='span' flex='1' gap={3}>
                    <Text as='span' fontSize={{ base: '2xl', md: '3xl' }} fontWeight='semibold'>{year.year}</Text>
                    <Badge colorPalette='teal' variant='subtle' size='md'>{countLabel(year.count)}</Badge>
                </HStack>
                <Accordion.ItemIndicator/>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
                <Accordion.ItemBody px={{ base: 2, md: 4 }} pt={0} pb={{ base: 2, md: 4 }}>
                    {/* Months of the year, January first; the newest month of the newest year starts open */}
                    <Accordion.Root multiple lazyMount defaultValue={y === 0 ? [year.months[year.months.length - 1].key] : []} variant='plain'>
                    {
                    year.months.map((month) => {
                        const hasCurrent = month.programs.some((p: any) => p.isCurrent);
                        return (
                        <Accordion.Item key={month.key} value={month.key} borderTopWidth='1px' borderColor='border'>
                            <Accordion.ItemTrigger px={{ base: 2, md: 2 }} py={3} cursor='pointer'>
                                <HStack as='span' flex='1' gap={2} wrap='wrap'>
                                    <Text as='span' fontSize={{ base: 'lg', md: 'xl' }} fontWeight='semibold'>{month.month}</Text>
                                    <Badge variant='outline' colorPalette='gray'>{countLabel(month.programs.length)}</Badge>
                                    {hasCurrent && <Badge colorPalette='yellow' variant='solid'>Publicado</Badge>}
                                </HStack>
                                <Accordion.ItemIndicator/>
                            </Accordion.ItemTrigger>
                            <Accordion.ItemContent>
                                <Accordion.ItemBody px={{ base: 1, md: 2 }} pt={1} pb={4}>
                                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={{ base: 3, md: 4 }}>
                                    {
                                    month.programs.map((mp: any) => (
                                        <ProgramRecord key={mp.id} program={mp}/>
                                    ))
                                    }
                                    </SimpleGrid>
                                </Accordion.ItemBody>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                        );
                    })
                    }
                    </Accordion.Root>
                </Accordion.ItemBody>
            </Accordion.ItemContent>
        </Accordion.Item>
    ))
    }
    </Flex>
    </Accordion.Root>
    )
}
