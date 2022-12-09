import React from 'react';
import { Box, Stack, HStack } from '@chakra-ui/react';

import { Copyright } from './Copyright';
import { SocialMediaLinks } from './SocialMediaLinks';
import { ColorModeToggle } from '../../ColorModeToggle';


export const Footer = () => {
	return (
		<Box as="footer" mx="auto" maxW="7xl" py="12" px={{ base: '4', md: '8' }}>
			<Stack
				direction={{ base: 'column-reverse', md: 'row' }}
				spacing="4"
				align="center"
				justify="space-between"
			>
				<HStack>
					<Copyright name={'ggwp.tw'} />
				</HStack>

				<HStack>
					<ColorModeToggle />
					<SocialMediaLinks />
				</HStack>
			</Stack>
		</Box>
	);
}