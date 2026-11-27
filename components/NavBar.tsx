'use client'

import Link from 'next/link'
import { Flex, Stack, Button } from '@chakra-ui/react'
import AuthCheck from '@/components/AuthCheck'
import { SignInButton, SignOutButton } from '@/components/SessionButtons'
import { ColorModeSwitch } from '@/components/ColorModeSwitch'

export function NavBar() {
    return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%" background="surface"
    mb={8} p={8}>
        <Stack direction="row">
            <Button asChild size="lg" variant="plain" px={8}><Link href='/programs/current'>Programas</Link></Button>
            <Button asChild size="lg" variant="plain" px={8}><Link href='/programs/songs'>Cantos</Link></Button>
            <Button asChild size="lg" variant="plain" px={8}><Link href='/programs/history'>Histórico</Link></Button>
        </Stack>
        <Stack direction="row" align="center" gap={4}>
            <ColorModeSwitch/>
            <SignInButton/>
            <AuthCheck>
                <SignOutButton/>
            </AuthCheck>
        </Stack>
    </Flex>
    )
}