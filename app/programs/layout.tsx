'use client'

import { Flex } from '@chakra-ui/react'
import { NavBar } from "@/components/NavBar"

export default function ProgramsLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
      <NavBar/>
      {/* Page container: pages fill its width, it sets the side gutter */}
      <Flex as="main" direction="column" align="center" w="100%" maxW="7xl" mx="auto"
      px={{ base: 4, md: 8 }} pb={{ base: 8, md: 12 }}>
        {children}
      </Flex>
      </>
    )
}
