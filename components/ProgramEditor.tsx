'use client'

import { Switch, Input, Flex, Button, Text } from '@chakra-ui/react'
import {
  DndContext, DragOverlay, MouseSensor, TouchSensor, closestCenter, pointerWithin,
  useDroppable, useSensor, useSensors,
  type Active, type Announcements, type CollisionDetection, type DragEndEvent, type DragMoveEvent, type DragStartEvent, type Over,
} from '@dnd-kit/core';
import { useState } from 'react';
import { BiSolidFileBlank, BiRevision } from 'react-icons/bi';
import { SongTabs } from '@/components/SongTabs';
import { SongTag, type DraggedSong } from '@/components/SongList';
import { ProgramSection } from '@/components/ProgramSection';
import { ProgramSongList, SongPill, type DraggedProgramSong } from '@/components/ProgramSongList';
import { toaster } from '@/components/ui/toaster';

const SECTIONS = [
  { type: 'recibimiento', title: 'Recibimiento' },
  { type: 'matutino', title: 'Matutino' },
  { type: 'vespertino', title: 'Vespertino' },
];

const SECTION_TYPES = SECTIONS.map((s) => s.type);
const titleOf = (type: unknown) => SECTIONS.find((s) => s.type === type)?.title ?? '';

// Drop targets are the sections (droppable id = type) and the songs inside them
// (sortable id = itemId, containerId = type). Returns the section of either.
const sectionOf = (over: Over | null): string | null => {
  if (!over) return null;
  const id = String(over.id);
  return SECTION_TYPES.includes(id) ? id : over.data.current?.sortable?.containerId ?? null;
};

// The section under the pointer decides where the song goes; inside it, the
// closest song (or the section itself when empty). Outside every section: nothing.
const collisionDetection: CollisionDetection = (args) => {
  const section = pointerWithin(args).find((hit) => SECTION_TYPES.includes(String(hit.id)));
  if (!section) return [];
  const items = args.droppableContainers.filter((c) => c.data.current?.sortable?.containerId === section.id);
  return items.length > 0 ? closestCenter({ ...args, droppableContainers: items }) : [section];
};

// Screen reader messages (dnd-kit's defaults are in English)
const announcements: Announcements = {
  onDragStart: ({ active }) => `Arrastrando ${active.data.current?.song.name}.`,
  onDragOver: ({ active, over }) => over
    ? `${active.data.current?.song.name} está sobre ${titleOf(sectionOf(over))}.`
    : `${active.data.current?.song.name} no está sobre ninguna sección.`,
  onDragEnd: ({ active, over }) => over
    ? `${active.data.current?.song.name} se soltó en ${titleOf(sectionOf(over))}.`
    : `${active.data.current?.song.name} no se movió.`,
  onDragCancel: ({ active }) => `Se canceló arrastrar ${active.data.current?.song.name}.`,
};
// Keyboard users don't drag: 1/2/3 add a catalog song (DraggableSong); in a
// section, ↑/↓ reorder, 1/2/3 move and Enter removes (ProgramSongList)
const screenReaderInstructions = {
  draggable: 'Arrastra el canto a una sección. Con teclado: en el catálogo, 1, 2 o 3 lo añade a Recibimiento, Matutino o Vespertino; en una sección, las flechas arriba y abajo lo reordenan, 1, 2 o 3 lo mueven a otra sección y enter lo quita.',
};

type Dragged = DraggedSong | DraggedProgramSong;
const fromSection = (d: Dragged): d is DraggedProgramSong => 'from' in d;

// A section that accepts dropped songs. While a song is being dragged, every
// section shows a dashed outline; the one under the pointer is highlighted.
function DropSection({ type, title, dragging, children }: { type: string, title: string, dragging: boolean, children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: type });

  return (
    <ProgramSection ref={setNodeRef} title={title} outline='2px dashed' outlineOffset='-2px'
    outlineColor={isOver ? 'teal.solid' : dragging ? 'border' : 'transparent'}
    bg={isOver ? 'teal.subtle' : 'surface'} transition='background 0.15s, outline-color 0.15s'>
      {children}
    </ProgramSection>
  );
}

// Shared layout of the new and edit service pages: the song catalog and the
// three sections with the date/publish form. Side by side from lg, stacked
// (catalog first) below that. Songs are dragged (mouse, or touch with
// press-and-hold) from the catalog into a section, within a section to reorder
// them, or from one section to another. Keyboard: see screenReaderInstructions.
export function ProgramEditor({ songs, programs, addProgramSong, moveProgramSong, deleteProgramSong, onSubmit, onReset, resetLabel, isLoading, defaultDate, defaultIsCurrent }: {
  songs: any,
  programs: any,
  addProgramSong: (programType: string, song: any, index?: number) => void,
  moveProgramSong: (from: string, to: string, song: any, index: number) => void,
  deleteProgramSong: (programType: string, song: any) => void,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  onReset: () => void,
  resetLabel: string,
  isLoading: boolean,
  defaultDate?: string,
  defaultIsCurrent?: boolean,
}) {
  const [dragged, setDragged] = useState<Dragged | null>(null);
  // Where a song from the catalog or another section would land (a line there)
  const [insertAt, setInsertAt] = useState<{ type: string, index: number } | null>(null);
  const sensors = useSensors(
    // A few pixels of movement before a drag starts, so a click doesn't drag
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    // Press and hold to drag on touch screens; a quick swipe still scrolls
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
  );

  // A section lists each song once (removing a song drops it by id)
  const isIn = (type: string, song: any) => programs[type].songs.some((s: any) => s.id === song.id);
  const alreadyThere = (type: string, song: any) =>
    toaster.create({ title: `${song.name} ya está en ${titleOf(type)}`, type: 'info', duration: 2000 });

  // Adds a song to a section unless it's already there. `confirm` shows a
  // toast, for the keyboard, where nothing moves on screen.
  const addToSection = (type: string, song: any, index?: number, confirm = false) => {
    if (isIn(type, song)) return alreadyThere(type, song);
    addProgramSong(type, song, index);
    if (confirm) toaster.create({ title: `${song.name} → ${titleOf(type)}`, type: 'success', duration: 1500 });
  };

  // Moves a song within a section, or to another one (at the end without an
  // index) unless it's already there. `confirm` as in addToSection.
  const moveToSection = (from: string, to: string, song: any, index?: number, confirm = false) => {
    if (from !== to && isIn(to, song)) return alreadyThere(to, song);
    moveProgramSong(from, to, song, index ?? programs[to].songs.length);
    if (confirm && from !== to) toaster.create({ title: `${song.name} → ${titleOf(to)}`, type: 'success', duration: 1500 });
  };

  // Where a song coming from the catalog or another section lands: before the
  // song it's over, or after it when its center is below that song's center;
  // at the end when it's over the section but not a song. Null for a drag
  // within one section (the list reorders itself) or outside every section.
  const landing = (active: Active, over: Over | null) => {
    const type = sectionOf(over);
    const data = active.data.current as Dragged | undefined;
    if (!type || !over || !data || (fromSection(data) && data.from === type)) return null;

    const sortable = over.data.current?.sortable;
    if (!sortable || sortable.containerId !== type) return { type, index: programs[type].songs.length };
    const rect = active.rect.current.translated;
    const below = rect !== null && rect.top + rect.height / 2 > over.rect.top + over.rect.height / 2;
    return { type, index: sortable.index + (below ? 1 : 0) };
  };

  const onDragStart = ({ active }: DragStartEvent) => setDragged(active.data.current as Dragged);

  const onDragMove = ({ active, over }: DragMoveEvent) => {
    const next = landing(active, over);
    if (next?.type !== insertAt?.type || next?.index !== insertAt?.index) setInsertAt(next);
  };

  const endDrag = () => {
    setDragged(null);
    setInsertAt(null);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    endDrag();
    const type = sectionOf(over);
    const data = active.data.current as Dragged;
    if (!type || !over || !data) return;

    // Reorder within a section: to the position of the song it's over (arrayMove)
    if (fromSection(data) && data.from === type) {
      const to = over.data.current?.sortable?.containerId === type ? over.data.current.sortable.index : programs[type].songs.length - 1;
      if (to !== data.index) moveProgramSong(type, type, data.song, to);
      return;
    }

    const target = landing(active, over);
    if (!target) return;
    if (fromSection(data)) moveToSection(data.from, target.type, data.song, target.index);
    else addToSection(target.type, data.song, target.index);
  };

  return (
    <DndContext id='program-editor' sensors={sensors} collisionDetection={collisionDetection}
    onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd} onDragCancel={endDrag}
    accessibility={{ announcements, screenReaderInstructions }}>
    <Flex w="100%" direction={{ base: 'column', lg: 'row' }} align={{ base: 'stretch', lg: 'start' }}
    gap={{ base: 6, lg: 12 }} py={{ base: 2, md: 4 }}>
      <Flex direction="column" w={{ base: '100%', lg: '50%' }} minW={0}>
        <Text color='fg.muted' fontSize='sm' mb={3}>
          Arrastra cada canto a Recibimiento, Matutino o Vespertino; dentro de una sección, arrástralo para cambiar su orden o llevarlo a otra sección. En pantallas táctiles, mantén presionado el canto para arrastrarlo. Con teclado, enfoca un canto y presiona 1, 2 o 3 (y ↑/↓ para ordenar).
        </Text>
        <SongTabs songs={songs} onAddSong={(type, song) => addToSection(type, song, undefined, true)}/>
      </Flex>
      <Flex direction="column" align="center" w={{ base: '100%', lg: '50%' }} minW={0}>
        {SECTIONS.map(({ type, title }) => (
          <DropSection key={type} type={type} title={title} dragging={dragged !== null}>
            <ProgramSongList program={programs[type]} programType={type} deleteProgramSong={deleteProgramSong}
            moveProgramSong={(from, to, song, index) => moveToSection(from, to, song, index, true)} insertAt={insertAt?.type === type ? insertAt.index : null}/>
          </DropSection>
        ))}
        <form onSubmit={onSubmit}>
          <Flex direction='column' align="center" gap={6} my={6}>
            <Input defaultValue={defaultDate} name='date' required variant='flushed' size="lg" type="date" w='auto'/>
            <Switch.Root defaultChecked={defaultIsCurrent} name='isCurrent' colorPalette='yellow' size='lg'>
              <Switch.HiddenInput/>
              <Switch.Label>Publicar programa?</Switch.Label>
              {/* The unchecked track defaults to the dark page background */}
              <Switch.Control bg='surface.track' _checked={{ bg: 'colorPalette.solid' }}/>
            </Switch.Root>
            <Flex wrap="wrap" justify="center" gap={4}>
              <Button size='lg' colorPalette='green' loading={isLoading} type='submit'><BiSolidFileBlank/> Guardar</Button>
              <Button size='lg' colorPalette='yellow' onClick={onReset}><BiRevision/> {resetLabel}</Button>
            </Flex>
          </Flex>
        </form>
      </Flex>
    </Flex>
    {/* The copy that follows the pointer; it can leave the scrolling song list */}
    <DragOverlay dropAnimation={null}>
      {dragged && (fromSection(dragged)
        ? <SongPill song={dragged.song} index={dragged.index} shadow='lg' cursor='grabbing'/>
        : <SongTag {...dragged} bg='surface' shadow='lg' cursor='grabbing'/>)}
    </DragOverlay>
    </DndContext>
  )
}
