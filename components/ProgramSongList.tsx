import { Highlight, Flex, Tag } from "@chakra-ui/react";
import { numberToEmoji } from '@/lib/Utils';
import { BiTrash } from 'react-icons/bi';

export function ProgramSongList({ program, programType, deleteProgramSong }:{ program: any, programType: string, deleteProgramSong: any}) {   
    if (program.order) {
        const order = program.order;
        const sortFn = (a:any, b:any) => order[a.name] - order[b.name];
        program.songs.sort(sortFn);
        delete program.order // Order should be dropped for the rest of the edit session or else update will try to keep it
    }
    
    return (
        program.songs?.map((song: any, i: number) => (
            <Flex key={song.id} direction='row' alignItems='center'>
            <Highlight key={song.id} query={`${numberToEmoji(i+1)} ${song.number || ''} ${song.name}`} styles={{ px: '3', py: '1', my:'2', rounded: 'full', bg: 'teal.100' }} >
                {`${numberToEmoji(i+1)} ${song.number || ''} ${song.name}`}
            </Highlight>
            <Tag key={i} as='button' size='lg' colorScheme='red' borderRadius='full' mx={2} onClick={() => deleteProgramSong(programType,song)}><BiTrash/></Tag>
            </Flex>
        ))
    )
}