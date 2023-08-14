'use client'

import { Card, CardBody, Text, Button, HStack, Link } from "@chakra-ui/react"

export function SongRecord({ program }: { program:any }) {
    const formatedDate = new Date(program.date)
    const options: any = { year: 'numeric', month: 'numeric' ,day: 'numeric' };
    
    return (
    <Card background='teal.600' m={2}>
        <CardBody>
            <HStack>
                <Text color='white'>{formatedDate.toLocaleDateString('es-MX',options)}</Text>
                <Link href={`/programs/history/${program.id}`}>
                    <Button colorScheme='gray' size="md" variant="solid" px={8}>Ver</Button>
                </Link>
            </HStack>
        </CardBody>
    </Card>
    )
}
