import { Highlight, Flex } from "@chakra-ui/react";
import { numberToEmoji } from '@/lib/Utils';

export function CurrentProgramSongList({ programSongs }:{ programSongs: Array<any> }) {   
    return (
        programSongs.map((song: any, i: number) => (
            <Flex key={song.id} direction='row' alignItems='center'>
                <Highlight key={song.id} query={`${numberToEmoji(i+1)} ${song.number || ''} ${song.name}`} styles={{ px: '3', py: '1', my:'2', rounded: 'full', bg: 'teal.100' }} >
                    {`${numberToEmoji(i+1)} ${song.number || ''} ${song.name}`}
                </Highlight>
            </Flex>
        ))
    )
}