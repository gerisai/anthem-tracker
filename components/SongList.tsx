'use client'

import { Box, Circle, Flex, Float, Heading, List, Badge, Tag, Tooltip, Portal } from "@chakra-ui/react";
import { useDraggable } from '@dnd-kit/core';
import { Fragment, useState } from 'react';
import { parseDate, recentDates, repeatColors, sortFns } from '@/lib/Utils';

// What a dragged song carries to the drop handler (ProgramEditor) and its overlay
export type DraggedSong = { song: any, number: number | string, color: string };

// A catalog song: its number and name, outlined in its usage color
export function SongTag({ song, number, color, extraEnd, ...rest }: DraggedSong & { extraEnd?: boolean } & Tag.RootProps) {
    return (
        <Tag.Root size='lg' borderRadius='full' variant='outline' colorPalette={color} maxW='100%'
        pe={extraEnd ? 4 : undefined} {...rest}>
            <Badge colorPalette={color} mr={2}>{number}</Badge>
            {/* v3 clamps tag labels to one truncated line; show full names as v2 did */}
            <Tag.Label lineClamp='unset'>{song.name}</Tag.Label>
        </Tag.Root>
    );
}

// Keys that add the focused song to a section without dragging
const SECTION_KEYS: Record<string, string> = { '1': 'recibimiento', '2': 'matutino', '3': 'vespertino' };

// Drag handle around a SongTag (new/edit service pages). Mouse drags start after
// moving a few pixels; touch drags after a press-and-hold, so the list still
// scrolls (sensors in ProgramEditor). The original stays in place, faded, while
// a DragOverlay copy follows the pointer out of the scrolling list. Keyboard:
// focus the song and press 1/2/3.
function DraggableSong({ data, onAddSong, children }: { data: DraggedSong, onAddSong: (programType: string, song: any) => void, children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: data.song.id, data });

    const onKeyDown = (e: React.KeyboardEvent) => {
        const type = SECTION_KEYS[e.key];
        if (type) {
            e.preventDefault();
            onAddSong(type, data.song);
        }
    };

    return (
        <Box ref={setNodeRef} {...listeners} {...attributes} onKeyDown={onKeyDown} aria-roledescription='canto arrastrable'
        cursor={isDragging ? 'grabbing' : 'grab'} opacity={isDragging ? 0.4 : 1} maxW='100%'
        userSelect='none' css={{ WebkitTouchCallout: 'none' }} rounded='full'
        _focusVisible={{ outline: '2px solid', outlineColor: 'teal.solid', outlineOffset: '2px' }}>
            {children}
        </Box>
    );
}

// With `onAddSong`, songs can be dragged onto a section of the service being
// edited (the DndContext lives in ProgramEditor) or added with 1/2/3; without
// it, the list is read-only
export function SongList({ type, songs, onAddSong }: {type: string, songs: Array<any>, onAddSong?: (programType: string, song: any) => void }) {
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

                const data: DraggedSong = { song, number: song.number || i + 1, color };
                const songTag = <SongTag {...data} extraEnd={repeats > 0}/>;

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
                    {onAddSong ? <DraggableSong data={data} onAddSong={onAddSong}>{songTag}</DraggableSong> : songTag}
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
