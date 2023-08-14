import { Highlight, Flex, Tag } from "@chakra-ui/react";
import { numberToEmoji } from '@/components/Emojis';
import { BiTrash } from 'react-icons/bi';

export function ProgramSongList({ programSongs, program, deleteProgramSong }:{ programSongs: Array<any>, program: string, deleteProgramSong: any}) {   
    return (
        programSongs.map((song: any, i: number) => (
            <Flex direction='row' alignItems='center'>
            <Highlight key={i} query={`${numberToEmoji(i+1)} ${song.number || ''} ${song.name}`} styles={{ px: '3', py: '1', my:'2', rounded: 'full', bg: 'teal.100' }} >
                {`${numberToEmoji(i+1)} ${song.number || ''} ${song.name}`}
            </Highlight>
            <Tag key={i} as='button' size='lg' colorScheme='red' borderRadius='full' mx={2} onClick={() => deleteProgramSong(program,song)}><BiTrash/></Tag>
            </Flex>
        ))
    )
}