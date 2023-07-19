'use client'

import { Flex, Stack, Heading, Button } from '@chakra-ui/react'

export function NavBar() {
    return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%" background="blue.400"
    mb={8} p={8}>
        <Stack direction="row">
            <Heading as="h1" size="lg" color="white">Administración de Cantos</Heading>
        </Stack>   
        <Heading as="h2" size="md" color="white">Nombre</Heading>
        <Stack direction="row">
            <Button color="white" variant="solid" borderRadius="25px">Settings</Button>
            <Button colorScheme="red">Cerrar Sesión</Button>
        </Stack>
    </Flex>
    )
}