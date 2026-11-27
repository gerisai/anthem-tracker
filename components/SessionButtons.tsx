import {  useSession, signIn, signOut } from 'next-auth/react'
import { Box, Button, Image } from '@chakra-ui/react'
import { BiLogOut } from 'react-icons/bi'


export function SignInButton() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <Button loading colorPalette='teal' variant='solid' size={{ base: 'sm', md: 'md' }} loadingText='Cargando'></Button>
    }

    if (status === 'authenticated') {
        return (
        <Image
            borderRadius='full'
            boxSize={{ base: '32px', md: '40px' }}
            src={session.user?.image ?? '/mememan.png'}
            alt={session.user?.name ?? 'Usuario'}
        />
        )
    }

    return <Button colorPalette="teal" size={{ base: 'sm', md: 'md' }} onClick={() => signIn()}>Iniciar Sesión</Button>
}

// Icon only on phones, where the nav bar has no room for the label
export function SignOutButton() {
    return (
        <Button colorPalette="red" onClick={() => signOut()} aria-label="Cerrar Sesión"
        size={{ base: 'sm', md: 'md' }} px={{ base: 2, md: 4 }}>
            <BiLogOut/>
            <Box as="span" hideBelow="md">Cerrar Sesión</Box>
        </Button>
    )
}