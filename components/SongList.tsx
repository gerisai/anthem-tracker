'use client'

import { Flex, Heading, List, ListItem, Badge, Tag, TagLabel, Menu, MenuList, MenuItem, Tooltip } from "@chakra-ui/react";
import { MenuButtonSong } from '@/components/MenuButton';
import { parseDate, repeatColors, sortFns } from '@/lib/Utils';



export function SongList({ type, songs, choosable, addProgramSong }: {type: string, songs: Array<any>, choosable: boolean, addProgramSong: any }) {
    const filteredSongs = songs.filter((song) => song.type === type.toLowerCase());

    filteredSongs.sort(sortFns[type.toLowerCase()]);
    const OFFSET = 30 * 24 * 60 * 60 * 1000;
    const referenceDate = new Date(Date.now() - OFFSET).getTime();

    return (
    <>
    <Heading color='white' my={6}>{type}s</Heading>
        <Flex style={ {overflowY: 'scroll', height: '400px' }}>
        <List color='white' spacing={3}>
        {
            filteredSongs.map((song: any, i: number) => {
                const repeats = song.dates.reduce((acc: number, date: any) => {
                    if(date.getTime() - referenceDate > 0) {
                        return acc + 1
                    }
                    return acc
                },0);

                const validDates = song.dates.filter((d: any) => d.getTime() - referenceDate > 0)

                const color = repeatColors[repeats] || 'red';
                
                return (           
                    <ListItem key={song.id}>
                    <Menu>
                        <MenuButtonSong choosable={choosable}>
                            <Tag size='lg' borderRadius='full' variant='outline' colorScheme={color} mx={1}>
                                <Badge colorScheme={color} mr={2}>{song.number || i + 1}</Badge>
                                <TagLabel>{song.name}</TagLabel>
                            </Tag>
                        </MenuButtonSong>
                        <Tooltip placement='right' label={
                            validDates.map((d: any) => {
                                return (
                                    <>
                                        {parseDate(d)}
                                        <br/>
                                    </>
                                )
                            })
                        }
                        hasArrow
                        offset={[0,20]}>
                        <Tag size='lg' borderRadius='full' variant='solid' colorScheme={color} mx={1}>
                            <Badge colorScheme={color}>{repeats || 0}</Badge>
                        </Tag>
                        </Tooltip>
                        <MenuList background='gray.700' borderColor='gray.500'>
                            <MenuItem background='gray.700' _hover={{ bg: 'gray.600' }} onClick={() => addProgramSong('recibimiento',song)}>Recibimiento</MenuItem>
                            <MenuItem background='gray.700' _hover={{ bg: 'gray.600' }} onClick={() => addProgramSong('matutino',song)}>Matutino</MenuItem>
                            <MenuItem background='gray.700' _hover={{ bg: 'gray.600' }} onClick={() => addProgramSong('vespertino',song)}>Vespertino</MenuItem>
                        </MenuList>
                    </Menu>
                    </ListItem>
                )
            })
        }
        </List>
        </Flex>
    </>
    )
}
