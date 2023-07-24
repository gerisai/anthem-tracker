'use client'

import { Heading, List, ListItem } from "@chakra-ui/react"

export function Songs({ title, songs }: {title: string, songs: Array<string>}) {
    return (
    <>
    <Heading color='white' mb={6}>{title}</Heading>
        <List color='white' spacing={3}>
        {
            songs.map((song: string) => (
            <ListItem>
                1️⃣ {song}
            </ListItem>
            ))
        }
        </List>
    </>
    )
}
