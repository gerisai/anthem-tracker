'use client'

import { Box, Circle, Flex, Float, Heading, List, Badge, Tag, Menu, Tooltip, Portal } from "@chakra-ui/react";
import { Fragment, useState } from 'react';
import { parseDate, recentDates, repeatColors, sortFns } from '@/lib/Utils';

const PROGRAM_TYPES = [
    { value: 'recibimiento', label: 'Recibimiento' },
    { value: 'matutino', label: 'Matutino' },
    { value: 'vespertino', label: 'Vespertino' },
];

// With `addProgramSong`, clicking a song opens a menu to add it to a program
export function SongList({ type, songs, addProgramSong }: {type: string, songs: Array<any>, addProgramSong?: (programType: string, song: any) => void }) {
    const filteredSongs = songs.filter((song) => song.type === type.toLowerCase());

    filteredSongs.sort(sortFns[type.toLowerCase()]);
    // Read the clock once per mount, not on every render
    const [now] = useState(() => Date.now());

    return (
    <>
    <Heading size={{ base: '2xl', md: '3xl' }} my={{ base: 4, md: 6 }}>{type}s</Heading>
        <Flex overflowY='auto' h={{ base: '60vh', lg: '400px' }} w='100%'>
        {/* Top/end padding leaves room for the usage badges, which overhang their tags */}
        <List.Root variant='plain' gap={3} w='100%' pt={2} pe={3}>
        {
            filteredSongs.map((song: any, i: number) => {
                const validDates = recentDates(song.dates, now);
                const repeats = validDates.length;

                const color = repeatColors[repeats] || 'red';

                const songTag = (
                    <Tag.Root size='lg' borderRadius='full' variant='outline' colorPalette={color} maxW='100%'
                    pe={repeats > 0 ? 4 : undefined}>
                        <Badge colorPalette={color} mr={2}>{song.number || i + 1}</Badge>
                        {/* v3 clamps tag labels to one truncated line; show full names as v2 did */}
                        <Tag.Label lineClamp='unset'>{song.name}</Tag.Label>
                    </Tag.Root>
                );

                // Uses in the last 30 days, as a notification-style count on the
                // tag's corner (the tag gets extra end padding so it doesn't cover the name); hidden when 0 (the teal outline already says so).
                // Hover shows the dates.
                const usageBadge = repeats > 0 && (
                    <Float placement='top-end' offsetX='1' offsetY='1'>
                        <Tooltip.Root positioning={{ placement: 'right', offset: { mainAxis: 8 } }} openDelay={0}>
                            <Tooltip.Trigger asChild>
                                <Circle size='5' bg='colorPalette.solid' color='colorPalette.contrast' colorPalette={color}
                                fontSize='xs' fontWeight='bold' borderWidth='2px' borderColor='page' cursor='default'
                                aria-label={`Usado ${repeats} ${repeats === 1 ? 'vez' : 'veces'} en los últimos 30 días`}>
                                    {repeats}
                                </Circle>
                            </Tooltip.Trigger>
                            <Portal>
                                <Tooltip.Positioner>
                                    <Tooltip.Content>
                                        <Tooltip.Arrow><Tooltip.ArrowTip/></Tooltip.Arrow>
                                        {validDates.map((d: Date, j: number) => (
                                            <Fragment key={j}>
                                                {parseDate(d)}
                                                <br/>
                                            </Fragment>
                                        ))}
                                    </Tooltip.Content>
                                </Tooltip.Positioner>
                            </Portal>
                        </Tooltip.Root>
                    </Float>
                );

                return (
                    <List.Item key={song.id}>
                    <Box position='relative' display='inline-flex' maxW='100%'>
                    {
                        addProgramSong ?
                        <Menu.Root>
                            <Menu.Trigger cursor='pointer' maxW='100%'>{songTag}</Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content background='surface' borderColor='border'>
                                        {PROGRAM_TYPES.map(({ value, label }) => (
                                            <Menu.Item key={value} value={value} _hover={{ bg: 'surface.hover' }} onClick={() => addProgramSong(value, song)}>{label}</Menu.Item>
                                        ))}
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                        :
                        songTag
                    }
                    {usageBadge}
                    </Box>
                    </List.Item>
                )
            })
        }
        </List.Root>
        </Flex>
    </>
    )
}
