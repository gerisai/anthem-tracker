import { Highlight } from "@chakra-ui/react";
import { numberToEmoji } from '@/components/Emojis';

export function ProgramSongList({ programSongs }:{ programSongs: Array<any>}) {   
    return (
        programSongs.map((song: any, i: number) => (
            <Highlight key={i} query={`${numberToEmoji(i+1)} ${song.name}`} styles={{ px: '3', py: '1', my:'2', rounded: 'full', bg: 'teal.100' }} >
                {`${numberToEmoji(i+1)} ${song.name}`}
            </Highlight>
        ))
    )
}