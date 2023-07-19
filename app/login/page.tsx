'use client'

import { Flex, Input, Heading, Button } from "@chakra-ui/react"

export default function Login(){
    return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex direction="column" background="gray.100" p={12} rounded={6}>
            <Heading mb={6}>Iniciar Sesión</Heading>
            <Input placeholder="example@email.com" variant="outline" mb={3} type="email" />
            <Input placeholder="********" variant="outline" mb={3} type="password"  />
            <Button colorScheme="teal">Entrar</Button>
        </Flex>
    </Flex>
    )
}
