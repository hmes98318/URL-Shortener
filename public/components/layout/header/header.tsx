import React from 'react';
import { Box, HStack, Spacer, Text } from '@chakra-ui/react';

import { Logo } from '../Logo';
import { Layout } from '../layout';


export const Header = () => {
	return (
			<Box
				as="header"
				mx="auto"
				maxW="7xl"
				py="3"
				px={{ base: '4', md: '8' }}
			>
				<HStack>
					<Text>Powered by</Text>
					<Logo size={60} />
					<Spacer />
				</HStack>
			</Box>
	);
}