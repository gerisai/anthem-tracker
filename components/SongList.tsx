'use client'

import { Heading, List, ListItem, Badge, Tag, TagLabel } from "@chakra-ui/react";

const repeatColors: any = {
    0: 'teal',
    1: 'yellow'
}

export function SongList({ type, songs }: {type: string, songs: Array<any>}) {
    const filteredSongs = songs.filter((song) => song.type === type.toLowerCase())

    const OFFSET = 30 * 24 * 60 * 60 * 1000;
    const referenceDate = new Date(Date.now() - OFFSET).getTime();

    return (
    <>
    <Heading color='white' mb={6}>{type}s</Heading>
        <List color='white' spacing={3}>
        {
            filteredSongs.map((song: any, i: number) => {
                const repeats = song.dates.reduce((acc: number, date: any) => {
                    if(date.getTime() - referenceDate > 0) {
                        return acc + 1
                    }
                    return acc
                },0);

                const color = repeatColors[repeats] || 'red';
                
                return (
                    <ListItem key={song.id}>
                        <Tag size='lg' borderRadius='full' variant='outline' colorScheme={color} mx={1}>
                            <Badge colorScheme={color} mr={2}>{song.number || i + 1}</Badge>
                            <TagLabel>{song.name}</TagLabel>
                        </Tag>
                        <Tag size='lg' borderRadius='full' variant='solid' colorScheme={color} mx={1}>
                            <Badge colorScheme={color}>{repeats || 0}</Badge>
                        </Tag>
                    </ListItem>
                )
            })
        }
        </List>
    </>
    )
}
