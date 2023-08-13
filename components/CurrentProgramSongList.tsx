import { Highlight, Flex, Tag } from "@chakra-ui/react";
import { numberToEmoji } from '@/components/Emojis';

export function CurrentProgramSongList({ programSongs }:{ programSongs: Array<any> }) {   
    return (
        programSongs.map((song: any, i: number) => (
            <Flex direction='row' alignItems='center'>
                <Highlight key={i} query={`${numberToEmoji(i+1)} ${song.number || ''} ${song.name}`} styles={{ px: '3', py: '1', my:'2', rounded: 'full', bg: 'teal.100' }} >
                    {`${numberToEmoji(i+1)} ${song.number || ''} ${song.name}`}
                </Highlight>
            </Flex>
        ))
    )
}