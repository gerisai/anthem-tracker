'use client'

import { Card, CardBody, Text, Button, HStack, Link } from "@chakra-ui/react";
import { parseDate } from "@/lib/Utils";

export function ProgramRecord({ program }: { program:any }) {
    const formatedDate = parseDate(program.date)
    
    return (
    <Card background={ program.isCurrent ? 'yellow.600' : 'teal.600'} m={2}>
        <CardBody>
            <HStack>
                <Text color='white'>{formatedDate}</Text>
                <Link href={`/programs/history/${program.id}`}>
                    <Button colorScheme='gray' size="md" variant="solid" px={8}>Ver</Button>
                </Link>
            </HStack>
        </CardBody>
    </Card>
    )
}
