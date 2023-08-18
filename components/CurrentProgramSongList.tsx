import { Highlight, Flex } from "@chakra-ui/react";
import { numberToEmoji } from '@/lib/Utils';

export function CurrentProgramSongList({ program }:{ program: any }) {   
    const order = program.order;
    const sortFn = (a:any, b:any) => order[a.name] - order[b.name];

    program.songs.sort(sortFn);
    
    return (
        program.songs.map((song: any, i: number) => (
            <Flex key={song.id} direction='row' alignItems='center'>
                <Highlight key={song.id} query={`${numberToEmoji(i+1)} ${song.number || ''} ${song.name}`} styles={{ px: '3', py: '1', my:'2', rounded: 'full', bg: 'teal.100' }} >
                    {`${numberToEmoji(i+1)} ${song.number || ''} ${song.name}`}
                </Highlight>
            </Flex>
        ))
    )
}