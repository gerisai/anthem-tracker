'use client'

import { Switch, Input, Flex, Button, useBreakpointValue } from '@chakra-ui/react'
import { BiSolidFileBlank, BiRevision } from 'react-icons/bi';
import { SongTabs } from '@/components/SongTabs';
import { ProgramSection } from '@/components/ProgramSection';
import { ProgramSongList } from '@/components/ProgramSongList';
import { toaster } from '@/components/ui/toaster';

const SECTIONS = [
  { type: 'recibimiento', title: 'Recibimiento' },
  { type: 'matutino', title: 'Matutino' },
  { type: 'vespertino', title: 'Vespertino' },
];

// Shared layout of the new and edit service pages: the song catalog and the
// three sections with the date/publish form. Side by side from lg, stacked
// (catalog first) below that.
export function ProgramEditor({ songs, programs, addProgramSong, deleteProgramSong, onSubmit, onReset, resetLabel, isLoading, defaultDate, defaultIsCurrent }: {
  songs: any,
  programs: any,
  addProgramSong: (programType: string, song: any) => void,
  deleteProgramSong: (programType: string, song: any) => void,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  onReset: () => void,
  resetLabel: string,
  isLoading: boolean,
  defaultDate?: string,
  defaultIsCurrent?: boolean,
}) {
  // Stacked layout: the sections are below the catalog, out of sight, so confirm
  // each added song with a toast
  const stacked = useBreakpointValue({ base: true, lg: false });
  const addSong = (programType: string, song: any) => {
    addProgramSong(programType, song);
    if (stacked) {
      const title = SECTIONS.find((s) => s.type === programType)?.title;
      toaster.create({ title: `${song.name} → ${title}`, type: 'success', duration: 1500 });
    }
  };

  return (
    <Flex w="100%" direction={{ base: 'column', lg: 'row' }} align={{ base: 'stretch', lg: 'start' }}
    gap={{ base: 6, lg: 12 }} py={{ base: 2, md: 4 }}>
      <Flex direction="column" w={{ base: '100%', lg: '50%' }} minW={0}>
        <SongTabs songs={songs} addProgramSong={addSong}/>
      </Flex>
      <Flex direction="column" align="center" w={{ base: '100%', lg: '50%' }} minW={0}>
        {SECTIONS.map(({ type, title }) => (
          <ProgramSection key={type} title={title}>
            <ProgramSongList program={programs[type]} programType={type} deleteProgramSong={deleteProgramSong}/>
          </ProgramSection>
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
  )
}
