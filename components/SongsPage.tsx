'use client'

import { Flex, Button, useDisclosure } from '@chakra-ui/react';
import { SongTabs } from '@/components/SongTabs';
import { NewSong } from '@/components/NewSong';
import { BiPlus } from 'react-icons/bi';
import { useRef } from 'react';
import AuthCheck from '@/components/AuthCheck';

export function SongsPage({ songs }: { songs: any }) {
    const { open, onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null);
    return (
        <Flex alignItems="center" justify="center" direction="column" m={2} p={2} w="80%">
        <AuthCheck editor>
            <Button ref={btnRef} onClick={onOpen} colorPalette='green' mb={8}><BiPlus/> Añadir canto</Button>
        </AuthCheck>
        <NewSong isOpen={open} onClose={onClose} btnRef={btnRef}/>
        <SongTabs songs={songs}/>
    </Flex>
    )
}
