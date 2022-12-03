import React from 'react';
import Link from 'next/link';
import { HStack } from '@chakra-ui/react';

import { Svg } from '../images/nextjs';


interface LogoProps {
	size: number;
}

export const Logo = ({ size }: LogoProps) => {
	return (
		<HStack spacing={3}>
			<Link href="https://nextjs.org/" target="_blank">
				<Svg
					width={size}
					height={size}
				/>
			</Link>
		</HStack>
	);
}