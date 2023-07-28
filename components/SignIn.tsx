'use client'

import { Flex, Heading, Button } from "@chakra-ui/react"
import { BiLogoGithub } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { signIn } from 'next-auth/react'

export default function SignIn({ providers }: { providers: any}){
    const providerTheming: any = {
        github: {
            scheme: 'blackAlpha',
            icon: <BiLogoGithub/>,
        },
        google: {
            scheme: 'gray',
            icon: <FcGoogle/>,
        }
    }

    return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex direction="column" background="gray.700" p={12} rounded={6}>
            <Heading color="white" mb={6}>Iniciar Sesión</Heading>
            {
                Object.values(providers).map((provider: any) => (
                    <Button 
                        key={provider.id} 
                        leftIcon={providerTheming[provider.id].icon}
                        colorScheme={providerTheming[provider.id].scheme}
                        onClick={async () => await signIn(provider.id,{ redirect: true, callbackUrl: '/'})} 
                        my={2}>{provider.name}
                    </Button>
                ))
            }
        </Flex>
    </Flex>
    )
}
