'use client'

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    FormControl,
    FormLabel,
    Select
} from '@chakra-ui/react'
import { BiSolidFileBlank, BiX } from 'react-icons/bi'

export function NewProgramSong({ isOpen, onClose, btnRef }: { isOpen: boolean, onClose: any, btnRef: any }) {

  return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
            finalFocusRef={btnRef}
            size='md'
        >
        <DrawerOverlay />
        <DrawerContent background='gray.700' color='white'>
          <DrawerCloseButton />
          <DrawerHeader>Añadir canto</DrawerHeader>

          <DrawerBody>
          <FormControl mb={4}>
                <FormLabel>Culto</FormLabel>
                <Select isDisabled>
                    <option>Recibimiento</option>
                </Select>
            </FormControl>
            <FormControl isRequired mb={4}>
                <FormLabel>Alabanza</FormLabel>
                <Select>
                    <option>1 Cada momento la vida me da</option>
                </Select>
            </FormControl>
          </DrawerBody>

          <DrawerFooter>
            <Button leftIcon={<BiX/>} mr={3} onClick={onClose} colorScheme='red'>
              Cancelar
            </Button>
            <Button leftIcon={<BiSolidFileBlank/>}colorScheme='teal'>Guardar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
}