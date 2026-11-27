import { Flex, Heading, Separator } from '@chakra-ui/react';

// One service section (Recibimiento, Matutino, Vespertino) and its songs
export function ProgramSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <Flex alignItems="center" justify="center" direction="column" background="gray.700" m={4} p={8} rounded={6} w="80%">
            <Heading>{title}</Heading>
            <Separator size='lg' variant='dashed' w='100%' mt={2} mb={6}/>
            {children}
        </Flex>
    )
}
