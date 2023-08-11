import { Highlight } from "@chakra-ui/react";

const emoji: any = {
    0: '0️⃣',
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣'
}

export function ProgramSongList({ program, programSongs }:{ program: string, programSongs: Array<any>}) {
    const filteredSongs = programSongs.filter((song) => song.program === program)
    
    return (
        filteredSongs.map((song: any, i: number) => (
            <Highlight key={i} query={(i+1).toString().split('').map((i) => emoji[i]).join('') + ' ' + song.name} styles={{ px: '3', py: '1', my:'2', rounded: 'full', bg: 'teal.100' }} >
                {(i+1).toString().split('').map((i) => emoji[i]).join('') + ' ' + song.name}
            </Highlight>
        ))
    )
}