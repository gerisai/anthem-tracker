'use client'

import { Flex, Tabs, TabList, Tab, TabPanels, TabPanel, Button, useDisclosure } from '@chakra-ui/react';
import { SongList } from '@/components/SongList';
import { NewSong } from '@/components/NewSong';
import { BiPlus } from 'react-icons/bi';
import { LegacyRef, useRef } from 'react';
import AuthCheck from '@/components/AuthCheck';

export function SongsPage({ songs }: { songs: any }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef(null);
    return (
        <Flex alignItems="center" justify="center" direction="column" m={2} p={2} w="80%">
        <AuthCheck>
            <Button ref={btnRef} onClick={onOpen} colorScheme='green' mb={8} leftIcon={<BiPlus/>}>Añadir canto</Button>
        </AuthCheck>
        <NewSong isOpen={isOpen} onClose={onClose} btnRef={btnRef}/>
        <Tabs variant='soft-rounded' colorScheme='teal' size='lg'>
            <TabList>
                <Tab>Himnario General</Tab>
                <Tab>Salmos</Tab>
                <Tab>Cantos</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <SongList addProgramSong={false} choosable={false} type='Himno' songs={songs}/>
                </TabPanel>
                <TabPanel>
                    <SongList addProgramSong={false} choosable={false} type='Salmo' songs={songs}/>
                </TabPanel>
                <TabPanel>
                    <SongList addProgramSong={false} choosable={false} type='Canto' songs={songs}/>
                </TabPanel>
            </TabPanels>
            </Tabs>
    </Flex>
    )
}