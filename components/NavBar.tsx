'use client'

import Link from 'next/link'
import { Flex, Stack, Button } from '@chakra-ui/react'
import AuthCheck from '@/components/AuthCheck'
import { SignInButton, SignOutButton } from '@/components/SessionButtons'

export function NavBar() {
    return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%" background="gray.700"
    mb={8} p={8}>
        <Stack direction="row">
            <Button asChild size="lg" color="white" variant="plain" px={8}><Link href='/programs/current'>Programas</Link></Button>
            <Button asChild size="lg" color="white" variant="plain" px={8}><Link href='/programs/songs'>Cantos</Link></Button>
            <Button asChild size="lg" color="white" variant="plain" px={8}><Link href='/programs/history'>Histórico</Link></Button>
        </Stack>
        <Stack direction="row">
            <SignInButton/>
            <AuthCheck>
                <SignOutButton/>
            </AuthCheck>
        </Stack>
    </Flex>
    )
}