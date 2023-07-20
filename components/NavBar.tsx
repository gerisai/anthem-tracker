'use client'

import { Flex, Stack, Button } from '@chakra-ui/react'
import { FcSettings } from "react-icons/fc";

export function NavBar() {
    return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%" background="gray.700"
    mb={8} p={8}>
        <Stack direction="row">
            <Button size="lg" color="white" variant="link" px={8}>Programas</Button>
            <Button size="lg" color="white" variant="link" px={8}>Cantos</Button>
            <Button size="lg" color="white" variant="link" px={8}>Histórico</Button>
        </Stack> 
        <Stack direction="row">
            <Button colorScheme="whiteAlpha" color="white" variant="outline" borderRadius="25px" leftIcon={<FcSettings/>}>Ajustes</Button>
            <Button colorScheme="red">Cerrar Sesión</Button>
        </Stack>
    </Flex>
    )
}