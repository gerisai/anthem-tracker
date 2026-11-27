import { Flex, FlexProps, Heading, Separator } from '@chakra-ui/react';

// One service section (Recibimiento, Matutino, Vespertino) and its songs. Extra
// props and `ref` go to the box (ProgramEditor makes it a drop target).
export function ProgramSection({ title, children, ref, ...rest }: { title: string, children: React.ReactNode, ref?: React.Ref<HTMLDivElement> } & FlexProps) {
    return (
        <Flex ref={ref} alignItems="center" justify="center" direction="column" background="surface" my={{ base: 2, md: 4 }}
        px={{ base: 4, md: 8 }} py={{ base: 5, md: 8 }} rounded="lg" shadow="sm" w="100%" maxW="2xl" {...rest}>
            <Heading size={{ base: '2xl', md: '3xl' }}>{title}</Heading>
            <Separator size='lg' variant='dashed' w='100%' mt={2} mb={{ base: 3, md: 6 }}/>
            {children}
        </Flex>
    )
}
