import { Box, Button, ButtonProps, Flex, Text } from "@chakra-ui/react";
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BiX } from 'react-icons/bi';
import { numberToEmoji } from '@/lib/Utils';

// Drag id of a song inside a section (the same song can be in several sections)
export const itemId = (type: string, song: any) => `${type}:${song.id}`;

// What a dragged section song carries to ProgramEditor's drop handler
export type DraggedProgramSong = { song: any, from: string, index: number };

// A song in a section, as a pill: its position, number and name, plus an ×
export function SongPill({ song, index, ref, ...rest }: { song: any, index: number, ref?: React.Ref<HTMLButtonElement> } & ButtonProps) {
    return (
        <Button ref={ref} rounded='full' size='sm' my={1} px={3} maxW='100%' h='auto' minH={8} py={1}
        whiteSpace='normal' textAlign='left' fontWeight='normal' fontSize='md'
        bg='teal.100' color='gray.900'
        _hover={{ bg: 'red.100', color: 'red.800' }} _focusVisible={{ bg: 'red.100', color: 'red.800' }} {...rest}>
            {`${numberToEmoji(index + 1)} ${song.number || ''} ${song.name}`}
            <BiX aria-hidden style={{ flexShrink: 0, opacity: 0.6 }}/>
        </Button>
    );
}

// Where a song dragged from elsewhere will land
function InsertLine() {
    return <Box h='3px' w='60%' my={1} rounded='full' bg='teal.solid' aria-hidden/>;
}

// One sortable song. Click (or Enter) removes it; dragging reorders it or moves
// it to another section. Keyboard: ↑/↓ reorder, 1/2/3 move to a section.
function SortableSong({ type, song, index, onRemove, onKeyMove }: {
    type: string, song: any, index: number,
    onRemove: () => void,
    onKeyMove: (e: React.KeyboardEvent) => void,
}) {
    const data: DraggedProgramSong = { song, from: type, index };
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: itemId(type, song), data });

    return (
        <SongPill ref={setNodeRef} song={song} index={index} {...attributes} {...listeners}
        aria-roledescription='canto ordenable' aria-label={`${song.name}, posición ${index + 1}. Enter lo quita.`}
        title='Arrastra para mover; haz clic para quitar'
        style={{ transform: CSS.Translate.toString(transform), transition }}
        opacity={isDragging ? 0.4 : 1} cursor={isDragging ? 'grabbing' : 'grab'}
        userSelect='none' css={{ WebkitTouchCallout: 'none' }}
        onClick={onRemove} onKeyDown={onKeyMove}/>
    );
}

const SECTION_KEYS: Record<string, string> = { '1': 'recibimiento', '2': 'matutino', '3': 'vespertino' };

// Songs of one section on the new/edit service pages, in order (EditProgramPage
// sorts saved songs by their order). The list is sortable within the
// DndContext in ProgramEditor; `insertAt` shows where a song dragged from the
// catalog or another section will go. The × is always shown, since phones have
// no hover; hover/focus turns the pill red.
export function ProgramSongList({ program, programType, deleteProgramSong, moveProgramSong, insertAt }: {
    program: any,
    programType: string,
    deleteProgramSong: (type: string, song: any) => void,
    moveProgramSong: (from: string, to: string, song: any, index?: number) => void,
    insertAt: number | null,
}) {
    const songs: any[] = program.songs ?? [];

    if (songs.length === 0) {
        return <Text color='fg.muted' fontSize='sm'>Arrastra cantos aquí</Text>;
    }

    const onKeyMove = (song: any, index: number) => (e: React.KeyboardEvent) => {
        const step = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
        if (step && index + step >= 0 && index + step < songs.length) {
            e.preventDefault();
            moveProgramSong(programType, programType, song, index + step);
        } else if (SECTION_KEYS[e.key] && SECTION_KEYS[e.key] !== programType) {
            e.preventDefault();
            moveProgramSong(programType, SECTION_KEYS[e.key], song);
        }
    };

    return (
        <SortableContext id={programType} items={songs.map((s) => itemId(programType, s))} strategy={verticalListSortingStrategy}>
            <Flex direction='column' align='center' w='100%'>
            {songs.map((song, i) => (
                <Flex key={song.id} direction='column' align='center' w='100%'>
                    {insertAt === i && <InsertLine/>}
                    <SortableSong type={programType} song={song} index={i}
                    onRemove={() => deleteProgramSong(programType, song)} onKeyMove={onKeyMove(song, i)}/>
                </Flex>
            ))}
            {insertAt === songs.length && <InsertLine/>}
            </Flex>
        </SortableContext>
    );
}
