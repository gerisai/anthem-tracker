'use client'

import { Flex, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react"
import { Songs } from "@/components/Songs"

export default function SongsPage() {
    return (
        <Flex alignItems="center" justify="center" direction="column" m={2} p={2} rounded={6} w="80%">
        <Tabs variant='soft-rounded' colorScheme='teal' size='lg'>
            <TabList>
                <Tab>Himnario General</Tab>
                <Tab>Salmos</Tab>
                <Tab>Cantos</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Songs title='Cantos' songs={['Cada momento la vida me da']}/>
                </TabPanel>
                <TabPanel>
                    <Songs title='Salmos' songs={['Salmo 1']}/>
                </TabPanel>
                <TabPanel>
                    <Songs title='Cantos' songs={['Solamente']}/>
                </TabPanel>
            </TabPanels>
            </Tabs>
    </Flex>
    )
}