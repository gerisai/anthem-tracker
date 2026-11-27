import {  useSession, signIn, signOut } from 'next-auth/react'
import { Button, Image } from '@chakra-ui/react'


export function SignInButton() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <Button loading colorPalette='teal' variant='solid' loadingText='Cargando'></Button>
    }

    if (status === 'authenticated') {
        return (
        <Image
            borderRadius='full'
            boxSize='40px'
            src={session.user?.image ?? '/mememan.png'}
            alt='Your Name'
        />
        )
    }

    return <Button colorPalette="teal" color="white" onClick={() => signIn()}>Iniciar Sesión</Button>
}

export function SignOutButton() {
    return <Button colorPalette="red" onClick={() => signOut()}>Cerrar Sesión</Button>
}