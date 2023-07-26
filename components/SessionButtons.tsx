import {  useSession, signIn, signOut } from 'next-auth/react'
import { Button, Image } from '@chakra-ui/react'


export function SignInButton() {
    const    { data: session, status } = useSession();

    if (status === 'loading') {
        return <h1>Hi mom</h1>
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

    return <Button colorScheme="teal" color="white" onClick={() => signIn()}>Iniciar Sesión</Button>
}

export function SignOutButton() {
    return <Button colorScheme="red" onClick={() => signOut()}>Cerrar Sesión</Button>
}