'use client'

import { Tabs } from '@chakra-ui/react'
import { SongList } from '@/components/SongList';

const TYPES = [
  { value: 'himno', type: 'Himno', label: 'Himnario General' },
  { value: 'salmo', type: 'Salmo', label: 'Salmos' },
  { value: 'canto', type: 'Canto', label: 'Cantos' },
];

// One tab per song type. With `onAddSong` (new/edit service pages), songs can be
// dragged onto a section or added with the keyboard; without it, read-only.
export function SongTabs({ songs, onAddSong }: { songs: any, onAddSong?: (programType: string, song: any) => void }) {
  return (
    <Tabs.Root defaultValue='himno' variant='subtle' colorPalette='teal' size={{ base: 'md', md: 'lg' }} w='100%'>
      <Tabs.List flexWrap='wrap'>
        {TYPES.map(({ value, label }) => (
          <Tabs.Trigger key={value} value={value} rounded='full' whiteSpace='nowrap'>{label}</Tabs.Trigger>
        ))}
      </Tabs.List>
      {TYPES.map(({ value, type }) => (
        <Tabs.Content key={value} value={value}>
          <SongList onAddSong={onAddSong} type={type} songs={songs}/>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
