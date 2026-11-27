'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flex, HStack, Button, Heading } from '@chakra-ui/react'
import AuthCheck from '@/components/AuthCheck'
import { SignInButton, SignOutButton } from '@/components/SessionButtons'
import { ColorModeSwitch } from '@/components/ColorModeSwitch'

const LINKS = [
    { href: '/programs/current', label: 'Programas', match: (p: string) => p.startsWith('/programs/current') },
    { href: '/programs/songs', label: 'Cantos', match: (p: string) => p.startsWith('/programs/songs') },
    { href: '/programs/history', label: 'Histórico', match: (p: string) => p.startsWith('/programs/history') },
];

// Phones: title and account controls on top, the links in a row below.
// md and up: one row, links on the left and controls on the right.
export function NavBar() {
    const pathname = usePathname() ?? '';

    return (
    <Flex as="nav" w="100%" background="surface" mb={{ base: 4, md: 8 }}
    px={{ base: 3, md: 8 }} py={{ base: 3, md: 6 }} gap={{ base: 2, md: 4 }}
    direction={{ base: 'column', md: 'row' }} align={{ base: 'stretch', md: 'center' }} justify="space-between">
        <Flex align="center" justify="space-between" order={{ base: 0, md: 1 }}>
            <Heading size="md" hideFrom="md" truncate minW={0} mr={2}>Programación de Cantos</Heading>
            <HStack gap={{ base: 2, md: 4 }}>
                <ColorModeSwitch/>
                <SignInButton/>
                <AuthCheck>
                    <SignOutButton/>
                </AuthCheck>
            </HStack>
        </Flex>
        <HStack gap={{ base: 1, md: 2 }} justify={{ base: 'space-between', md: 'start' }}>
            {LINKS.map(({ href, label, match }) => {
                const active = match(pathname);
                return (
                    <Button key={href} asChild size={{ base: 'md', md: 'lg' }} flex={{ base: 1, md: 'none' }}
                    px={{ base: 2, md: 6 }} rounded="full" colorPalette="teal"
                    variant={active ? 'subtle' : 'ghost'} aria-current={active ? 'page' : undefined}>
                        <Link href={href}>{label}</Link>
                    </Button>
                );
            })}
        </HStack>
    </Flex>
    )
}
