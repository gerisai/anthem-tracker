'use client'

import { Flex, Tabs, TabList, Tab, TabPanels, TabPanel, Button, useDisclosure } from '@chakra-ui/react';
import { SongList } from '@/components/SongList';
import { NewSong } from '@/components/NewSong';
import { BiPlus } from 'react-icons/bi';
import { useRef } from 'react';

export function SongsPage({ songs }: { songs: any }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()
    return (
        <Flex alignItems="center" justify="center" direction="column" m={2} p={2} w="80%">
        <Button ref={btnRef} onClick={onOpen} colorScheme='green' mb={8} leftIcon={<BiPlus/>}>Añadir canto</Button>
        <NewSong isOpen={isOpen} onClose={onClose} btnRef={btnRef}/>
        <Tabs variant='soft-rounded' colorScheme='teal' size='lg'>
            <TabList>
                <Tab>Himnario General</Tab>
                <Tab>Salmos</Tab>
                <Tab>Cantos</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <SongList type='Himno' songs={songs}/>
                </TabPanel>
                <TabPanel>
                    <SongList type='Salmo' songs={songs}/>
                </TabPanel>
                <TabPanel>
                    <SongList type='Canto' songs={songs}/>
                </TabPanel>
            </TabPanels>
            </Tabs>
    </Flex>
    )
}