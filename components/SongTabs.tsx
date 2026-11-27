'use client'

import { Tabs } from '@chakra-ui/react'
import { SongList } from '@/components/SongList';

const TYPES = [
  { value: 'himno', type: 'Himno', label: 'Himnario General' },
  { value: 'salmo', type: 'Salmo', label: 'Salmos' },
  { value: 'canto', type: 'Canto', label: 'Cantos' },
];

// One tab per song type. With `addProgramSong`, each song opens a menu to add it
// to a program (new/edit service pages); without it, the list is read-only.
export function SongTabs({ songs, addProgramSong }: { songs: any, addProgramSong?: (programType: string, song: any) => void }) {
  return (
    <Tabs.Root defaultValue='himno' variant='subtle' colorPalette='teal' size={{ base: 'md', md: 'lg' }} w='100%'>
      <Tabs.List flexWrap='wrap'>
        {TYPES.map(({ value, label }) => (
          <Tabs.Trigger key={value} value={value} rounded='full' whiteSpace='nowrap'>{label}</Tabs.Trigger>
        ))}
      </Tabs.List>
      {TYPES.map(({ value, type }) => (
        <Tabs.Content key={value} value={value}>
          <SongList addProgramSong={addProgramSong} type={type} songs={songs}/>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
