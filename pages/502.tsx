import React from "react";
import { Box, Center, Heading, Spacer, Stack, VStack } from "@chakra-ui/react";
import { Text } from '@chakra-ui/react';
import { Layout } from "../public/components/layout/layout";

export default () => {
    return (
        <Layout>
            <Center>
                <Heading>
                    502 Bad Gateway
                </Heading>
            </Center>
            <VStack minH="30vh" padding={3} spacing={10} mt={'50px'}>
                <Center>
                    <Text>
                        Sorry, the page you are looking for is currently unavailable.<br />
                        Please try again later.
                    </Text>
                </Center>
                <Center>
                    <Text>
                        If you are the system administrator of this resource
                        then you should check the error log for details.
                    </Text>
                </Center>
            </VStack>
        </Layout>
    );
};