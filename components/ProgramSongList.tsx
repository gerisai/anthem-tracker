import { Button } from "@chakra-ui/react";
import { numberToEmoji } from '@/lib/Utils';
import { BiX } from 'react-icons/bi';

// Songs of one section on the new/edit service pages. Each song is a button:
// clicking it removes it from the section. The × is always shown, since phones
// have no hover; hover/focus turns it red.
export function ProgramSongList({ program, programType, deleteProgramSong }:{ program: any, programType: string, deleteProgramSong: any}) {
    if (program.order) {
        const order = program.order;
        const sortFn = (a:any, b:any) => order[a.name] - order[b.name];
        program.songs.sort(sortFn);
        delete program.order // Order should be dropped for the rest of the edit session or else update will try to keep it
    }

    return (
        program.songs?.map((song: any, i: number) => (
            <Button key={song.id} onClick={() => deleteProgramSong(programType, song)}
            aria-label={`Quitar ${song.name}`} title='Quitar canto'
            rounded='full' size='sm' my={1} px={3} maxW='100%' h='auto' minH={8} py={1}
            whiteSpace='normal' textAlign='left' fontWeight='normal' fontSize='md'
            bg='teal.100' color='gray.900'
            _hover={{ bg: 'red.100', color: 'red.800' }} _focusVisible={{ bg: 'red.100', color: 'red.800' }}>
                {`${numberToEmoji(i+1)} ${song.number || ''} ${song.name}`}
                <BiX aria-hidden style={{ flexShrink: 0, opacity: 0.6 }}/>
            </Button>
        ))
    )
}
