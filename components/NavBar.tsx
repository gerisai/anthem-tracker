'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flex, HStack, Button, Heading } from '@chakra-ui/react'
import AuthCheck from '@/components/AuthCheck'
import { SignInButton, SignOutButton } from '@/components/SessionButtons'
import { LogoMark } from '@/components/Logo'

const LINKS = [
    { href: '/programs/current', label: 'Programas', match: (p: string) => p.startsWith('/programs/current') },
    { href: '/programs/songs', label: 'Cantos', match: (p: string) => p.startsWith('/programs/songs') },
    { href: '/programs/history', label: 'Histórico', match: (p: string) => p.startsWith('/programs/history') },
];

// Phones: logo + title and account controls on top, the links in a row below.
// md and up: one row, logo and links on the left and controls on the right.
// The logo links to the current program, like the root URL.
export function NavBar() {
    const pathname = usePathname() ?? '';

    return (
    <Flex as="nav" w="100%" background="surface" mb={{ base: 4, md: 8 }}
    px={{ base: 3, md: 8 }} py={{ base: 3, md: 6 }} gap={{ base: 2, md: 4 }}
    direction={{ base: 'column', md: 'row' }} align={{ base: 'stretch', md: 'center' }} justify="space-between">
        <Flex align="center" justify="space-between" order={{ base: 0, md: 1 }}>
            <Flex asChild align="center" gap={2} minW={0} mr={2} hideFrom="md">
                <Link href="/programs/current" aria-label="Programación de Cantos, inicio">
                    <LogoMark size={28}/>
                    {/* Wraps to two lines rather than cutting off when the controls are wide (signed out) */}
                    <Heading size="sm" lineClamp={2} lineHeight="short">Programación de Cantos</Heading>
                </Link>
            </Flex>
            <HStack gap={{ base: 2, md: 4 }}>
                <SignInButton/>
                <AuthCheck>
                    <SignOutButton/>
                </AuthCheck>
            </HStack>
        </Flex>
        <HStack gap={{ base: 1, md: 2 }} justify={{ base: 'space-between', md: 'start' }}>
            <Flex asChild hideBelow="md" mr={4} rounded="lg" _focusVisible={{ outline: '2px solid', outlineColor: 'teal.solid', outlineOffset: '2px' }}>
                <Link href="/programs/current" aria-label="Programación de Cantos, inicio" title="Programación de Cantos">
                    <LogoMark size={40}/>
                </Link>
            </Flex>
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
