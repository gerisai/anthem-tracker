'use client'

import { Flex, Heading, Button } from "@chakra-ui/react"
import { BiLogoGithub } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { signIn } from 'next-auth/react'

export default function SignIn({ providers }: { providers: any}){
    const providerTheming: any = {
        github: {
            variant: 'solid',
            icon: <BiLogoGithub/>,
        },
        google: {
            variant: 'outline',
            icon: <FcGoogle/>,
        }
    }

    return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex direction="column" background="surface" p={12} rounded={6}>
            <Heading mb={6}>Iniciar Sesión</Heading>
            {
                Object.values(providers).map((provider: any) => (
                    <Button 
                        key={provider.id} 
                        colorPalette='gray'
                        variant={providerTheming[provider.id].variant}
                        onClick={async () => await signIn(provider.id,{ redirect: true, callbackUrl: '/'})}
                        my={2}>{providerTheming[provider.id].icon} {provider.name}
                    </Button>
                ))
            }
        </Flex>
    </Flex>
    )
}
