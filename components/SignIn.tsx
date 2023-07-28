'use client'

import { Flex, Heading, Button } from "@chakra-ui/react"
import { signIn } from 'next-auth/react'

export default function SignIn({ providers }: { providers: any}){

    console.log(providers)
    return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex direction="column" background="gray.700" p={12} rounded={6}>
            <Heading color="white" mb={6}>Iniciar Sesión</Heading>
            {
                Object.values(providers).map((provider: any) => (
                    <Button colorScheme="teal" onClick={async () => await signIn(provider.id,{ redirect: true,
                        callbackUrl: '/'})}>{provider.name}</Button>
                ))
            }
        </Flex>
    </Flex>
    )
}
