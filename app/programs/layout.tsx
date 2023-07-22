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
      <Flex align="center" justify="center" w="100%" mx={8}>
        {children}
      </Flex>
      </>
    )
}