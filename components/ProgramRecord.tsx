'use client'

import { Card, Text, Button, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { parseDate } from "@/lib/Utils";

export function ProgramRecord({ program }: { program:any }) {
    const formatedDate = parseDate(program.date)
    
    return (
    <Card.Root background={ program.isCurrent ? 'yellow.600' : 'teal.600'} borderWidth={0}>
        <Card.Body px={4} py={3}>
            <HStack justify='space-between'>
                <Text color='white' fontWeight='medium'>{formatedDate}</Text>
                <Button asChild colorPalette='gray' size="md" variant="solid" px={6}>
                    <NextLink href={`/programs/history/${program.id}`}>Ver</NextLink>
                </Button>
            </HStack>
        </Card.Body>
    </Card.Root>
    )
}
