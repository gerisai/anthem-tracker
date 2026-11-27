'use client'

import { Drawer, Portal, CloseButton, Button, Input, Field, NativeSelect } from '@chakra-ui/react';
import { useState } from 'react';
import { toaster } from '@/components/ui/toaster';

export function NewSong({ isOpen, onClose, btnRef }: { isOpen: boolean, onClose: () => void, btnRef: React.RefObject<HTMLButtonElement | null> }) {
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

    setIsLoading(false);

    if (!res.ok) {
      toaster.create({ title: 'No se pudo guardar el canto', type: 'error' });
      return;
    }

    onClose();
    location.reload();
  }

  return (
        <Drawer.Root
            open={isOpen}
            placement='end'
            onOpenChange={(e) => { if (!e.open) onClose(); }}
            finalFocusEl={() => btnRef.current}
            size='lg'
        >
        <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
        <Drawer.Content asChild background='gray.700' color='white'>
          <form onSubmit={createSong}>
          <Drawer.Header>
            <Drawer.Title>Nuevo canto</Drawer.Title>
          </Drawer.Header>

          <Drawer.Body>
            <Field.Root required mb={4}>
                <Field.Label>Nombre <Field.RequiredIndicator /></Field.Label>
                <Input name='name' placeholder='Hay un pais'/>
            </Field.Root>
            <Field.Root required mb={4}>
                <Field.Label>Tipo <Field.RequiredIndicator /></Field.Label>
                <NativeSelect.Root>
                    <NativeSelect.Field name='type'>
                        <option value='salmo'>Salmo</option>
                        <option value='canto'>Canto</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                </NativeSelect.Root>
            </Field.Root>
          </Drawer.Body>

          <Drawer.Footer>
            <Button mr={3} onClick={onClose} colorPalette='red'>
              Cancelar
            </Button>
            <Button loading={isLoading} type='submit' colorPalette='teal'>Guardar</Button>
          </Drawer.Footer>

          <Drawer.CloseTrigger asChild>
            <CloseButton size='sm' />
          </Drawer.CloseTrigger>
          </form>
        </Drawer.Content>
        </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    )
}
