'use client'

import { Flex, Input, Heading, Button } from "@chakra-ui/react"

export default function Login(){
    return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex direction="column" background="gray.700" p={12} rounded={6}>
            <Heading color="white" mb={6}>Iniciar Sesión</Heading>
            <Input color="white" placeholder="example@email.com" variant="outline" mb={3} type="email" />
            <Input color="white" placeholder="********" variant="outline" mb={3} type="password"  />
            <Button colorScheme="blue">Entrar</Button>
        </Flex>
    </Flex>
    )
}
