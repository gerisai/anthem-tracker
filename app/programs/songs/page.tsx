'use client'

import { Flex, Tabs, TabList, Tab, TabPanels, TabPanel, Button, useDisclosure } from '@chakra-ui/react'
import { Songs } from '@/components/Songs'
import { NewSong } from '@/components/NewSong'
import { BiPlus } from 'react-icons/bi';
import { useRef } from 'react'

export default function SongsPage() {
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
                    <Songs title='Cantos' songs={['Cada momento la vida me da']}/>
                </TabPanel>
                <TabPanel>
                    <Songs title='Salmos' songs={['Salmo 1']}/>
                </TabPanel>
                <TabPanel>
                    <Songs title='Cantos' songs={['Solamente']}/>
                </TabPanel>
            </TabPanels>
            </Tabs>
    </Flex>
    )
}