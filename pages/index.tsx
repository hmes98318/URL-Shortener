import React from 'react';
import { useState } from 'react';
import {
    Center,
    Heading,
    Box,
    Stack,
    HStack,
    VStack,
    Button,
    IconButton,
    Spacer,
    Input,
    useColorModeValue,
    useToast,
    useClipboard
} from '@chakra-ui/react';
import { Check, Copy, Refresh } from '@icon-park/react';
import isUrl from 'is-url';
import axios from 'axios';

import { Layout } from '../public/components/layout/layout';
import { NextChakraLink } from '../public/components/NextChakraLink';

import type { NextPage } from 'next';



export async function getStaticProps() {
    return {
        props: {},
    };
}
const Home: NextPage = () => {
    const toast = useToast();

    const inputActiveBg = useColorModeValue('gray.300', 'rgba(132,133,141,0.24)');
    const bgColor = useColorModeValue('gray.200', 'rgba(132,133,141,0.12)');

    const [url, setUrl] = useState<string>('');
    const [shortUrl, setShortUrl] = useState('');
    const [loading, setLoading] = useState(false);

    //navigator.clipboard.writeText(shortUrl);
    const { hasCopied, onCopy } = useClipboard(shortUrl);


    const handleClick = async () => {

        setLoading(true);

        const sendData = {
            method: 'POST',
            data: JSON.stringify({ fullUrl: url })
        }
        console.log(sendData)


        const res = await axios.post('/api', sendData)
        setLoading(false);
        console.log(res.data)

        if (res.status === 201) {
            const { data } = await res.data;
            setShortUrl(data.shortUrl);
            navigator.clipboard.writeText(data.shortUrl);
        }
        else {
            toast({
                title: 'shortError',
                status: 'error',
                position: 'top',
                isClosable: true,
            });
        }
    }

    return (
        <Layout>
            <Center>
                <Heading>
                    Home
                </Heading>
            </Center>
            <VStack minH="30vh" padding={3} spacing={10} mt={'100px'}>
                <HStack
                    as={'form'}
                    spacing={0}
                    borderWidth={1}
                    rounded="lg"
                    backgroundColor={bgColor}
                    _focusWithin={{
                        backgroundColor: inputActiveBg,
                    }}
                    _hover={{
                        backgroundColor: inputActiveBg,
                    }}
                    width={{ base: '350px', md: '500px', lg: '700px' }}
                >
                    <Input
                        backgroundColor={'transparent'}
                        rounded="lg"
                        border={'none'}
                        variant="filled"
                        size={{ base: 'md', md: 'lg' }}
                        defaultValue={url}
                        onChange={(e) => setUrl(e.currentTarget.value)}
                    />
                    <IconButton
                        type="submit"
                        aria-label={'search'}
                        icon={<Refresh />}
                        variant="ghost"
                        isDisabled={!isUrl(url)}
                        onClick={handleClick}
                        isLoading={loading}
                    />
                </HStack>

                {shortUrl.length > 0 ? (
                    <>
                        <Box
                            w={{ base: 'xs', sm: 'sm', md: 'md', lg: '3xl' }}
                            p={{ base: 3, md: 7 }}
                            rounded="lg"
                            borderStyle="dotted"
                            borderWidth="3px"
                        >
                            <Stack
                                direction={{ base: 'column', md: 'row' }}
                                alignItems="center"
                                textAlign="center"
                            >
                                <NextChakraLink href={shortUrl} color="blue.500">
                                    {shortUrl}
                                </NextChakraLink>
                                <Spacer />
                                <Button
                                    w={{ base: '3xs', md: '25%' }}
                                    p={3}
                                    onClick={onCopy}
                                    leftIcon={hasCopied ? <Check fill="#7ed321" /> : <Copy />}
                                >
                                    {hasCopied ? 'copied' : 'copy'}
                                </Button>
                            </Stack>
                        </Box>
                    </>
                ) : null}
            </VStack>
        </Layout>
    );
}
export default Home;