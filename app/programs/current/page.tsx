'use client'

import { Heading, Divider, Highlight, Flex } from '@chakra-ui/react'

export default function Programs() {
  return (
    <Flex color='white' alignItems="center" justify="center" w="80%"
    mx={8} px={8} direction="column">
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Recibimiento</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
        </Flex>
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Matutino</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
        <Highlight query='1️⃣ 65 Salid valientes batallones' styles={{ px: '3', py: '1', rounded: 'full', bg: 'teal.100' }} >
            1️⃣ 65 Salid valientes batallones   
        </Highlight>
        </Flex>
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4}p={8} rounded={6} w="80%">
        <Heading>Vespertino</Heading>
        <Divider size='lg'variant='dashed' mt={2} mb={6}/>
        <Highlight query='1️⃣ 65 Salid valientes batallones' styles={{ px: '3', py: '1', rounded: 'full', bg: 'teal.100' }} >
            1️⃣ 65 Salid valientes batallones   
        </Highlight>
        </Flex>
    </Flex>
  )
}
