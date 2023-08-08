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
    Input,
    FormControl,
    FormLabel,
    Select
} from '@chakra-ui/react'
import { useState } from 'react'

export function NewSong({ isOpen, onClose, btnRef }: { isOpen: boolean, onClose: any, btnRef: any }) {
  const [isLoading, setIsLoading ] = useState(false);

  const createSong = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const body = {
      name: formData.get('name'),
      type: formData.get('type'),
    };

    const res = await fetch('/api/song', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await res.json();
    onClose();
    setIsLoading(false);
  }
  
  return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
            finalFocusRef={btnRef}
            size='lg'
        >
        <DrawerOverlay />
        <form onSubmit={createSong}>
        <DrawerContent background='gray.700' color='white'>
          <DrawerCloseButton />
          <DrawerHeader>Nuevo canto</DrawerHeader>

          <DrawerBody>
            <FormControl isRequired mb={4}>
                <FormLabel>Nombre</FormLabel>
                    <Input name='name' placeholder='Hay un pais'/>
            </FormControl>
            <FormControl isRequired mb={4}>
                <FormLabel>Tipo</FormLabel>
                <Select name='type'>
                    <option value='Salmo'>Salmo</option>
                    <option value='Canto'>Canto</option>
                </Select>
            </FormControl>
          </DrawerBody>

          <DrawerFooter>
            <Button mr={3} onClick={onClose} colorScheme='red'>
              Cancelar
            </Button>
            <Button isLoading={isLoading}  type='submit' colorScheme='teal'>Guardar</Button>
          </DrawerFooter>
        </DrawerContent>
        </form>
      </Drawer>
    )
}