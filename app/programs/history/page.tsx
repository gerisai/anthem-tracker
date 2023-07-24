'use client'

import { Flex, Card, CardBody, Text, Button, HStack, Heading, Divider } from "@chakra-ui/react"
import { SongRecord } from '@/components/SongRecord'

export default function SongsPage() {
    return (
    <Flex color='white' alignItems="center" justify="left" direction="column" m={2} p={2} rounded={6} w="100%">
    <Heading mx={4}>Julio</Heading>
    <Divider size='lg'variant='dashed' mt={2} mb={6}/>
    <Flex wrap='wrap' color='white' alignItems="left" justify="left" direction="row" mx={2} w="100%">
        <SongRecord date='08-07-2023'/>
        <SongRecord date='15-07-2023'/>
        <SongRecord date='22-07-2023'/>
    </Flex>
    </Flex>
    )
}