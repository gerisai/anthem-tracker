'use client'

import { Flex, Tabs } from '@chakra-ui/react'
import { SongList } from '@/components/SongList';

const TYPES = [
  { value: 'himno', type: 'Himno', label: 'Himnario General' },
  { value: 'salmo', type: 'Salmo', label: 'Salmos' },
  { value: 'canto', type: 'Canto', label: 'Cantos' },
];

// One tab per song type. With `onAddSong` (new/edit service pages), songs can be
// dragged onto a section or added with the keyboard; without it, read-only.
// `actions` goes at the end of the tab row (outside the tablist); with it,
// phones get smaller tabs so both fit on one row.
export function SongTabs({ songs, onAddSong, actions }: { songs: any, onAddSong?: (programType: string, song: any) => void, actions?: React.ReactNode }) {
  return (
    <Tabs.Root defaultValue='himno' variant='subtle' colorPalette='teal' size={{ base: actions ? 'sm' : 'md', md: 'lg' }} w='100%'>
      <Flex align='center' gap={2}>
        <Tabs.List flexWrap='wrap' flex='1'>
          {TYPES.map(({ value, label }) => (
            <Tabs.Trigger key={value} value={value} rounded='full' whiteSpace='nowrap'>{label}</Tabs.Trigger>
          ))}
        </Tabs.List>
        {actions}
      </Flex>
      {TYPES.map(({ value, type }) => (
        <Tabs.Content key={value} value={value}>
          <SongList onAddSong={onAddSong} type={type} songs={songs}/>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
