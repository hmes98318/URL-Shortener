import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HStack } from '@chakra-ui/react';

import img from '../../public/images/next-js.svg';


interface LogoProps {
	size: number;
}

export const Logo = ({ size }: LogoProps) => {
	return (
		<HStack spacing={3}>
			<Link href="https://nextjs.org/" target="_blank">
				<Image
					src={img}
					alt="logo"
					width={size}
					height={size}
				/>
			</Link>
		</HStack>
	);
}