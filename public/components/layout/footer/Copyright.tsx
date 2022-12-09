import React from 'react';
import { Text, TextProps } from '@chakra-ui/react';


interface CopyrightProps extends TextProps {
	name: string
}

export const Copyright = (props: CopyrightProps) => {
	return (
		<Text fontSize="sm" {...props}>
			&copy; {new Date().getFullYear()} {props.name}, All rights reserved.
		</Text>
	);
}