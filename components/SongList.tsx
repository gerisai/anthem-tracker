'use client'

import { Heading, List, ListItem, Badge, Tag, TagLabel, Highlight } from "@chakra-ui/react";

export function SongList({ type, songs }: {type: string, songs: Array<any>}) {
    const filteredSongs = songs.filter((song) => song.type === type.toLowerCase())

    return (
    <>
    <Heading color='white' mb={6}>{type}s</Heading>
        <List color='white' spacing={3}>
        {
            filteredSongs.map((song: any, i: number) => (
                <ListItem key={song.id}>
                    <Tag size='lg' borderRadius='full' variant='outline' colorScheme='teal' mx={1}>
                        <Badge colorScheme='teal' mr={2}>{song.number ? song.number : i + 1}</Badge>
                        <TagLabel>{song.name}</TagLabel>
                    </Tag>
                    <Tag size='lg' borderRadius='full' variant='solid' colorScheme='teal' mx={1}>
                        <Badge colorScheme='teal'>1</Badge>
                    </Tag>
                </ListItem>
                ))
        }
        </List>
    </>
    )
}
