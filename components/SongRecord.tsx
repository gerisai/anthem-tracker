'use client'

import { Card, CardBody, Text, Button, HStack } from "@chakra-ui/react"

export function SongRecord({ date }: { date:string }) {
    return (
    <Card background='teal.600' m={2}>
        <CardBody>
            <HStack>
                <Text color='white'>{date}</Text><Button colorScheme='gray' size="md" variant="solid" px={8}>Ver</Button>
            </HStack>
        </CardBody>
    </Card>
    )
}
