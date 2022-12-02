import React from 'react';
import { ButtonGroup, ButtonGroupProps, IconButton } from '@chakra-ui/react';
import { GithubOne, Twitter } from '@icon-park/react';


export const SocialMediaLinks = (props: ButtonGroupProps) => {
	return (
		<ButtonGroup variant="ghost" {...props}>
			<IconButton
				as="a"
				href="https://github.com/hmes98318"
				aria-label="GitHub"
				target="_blank"
				icon={<GithubOne size="20px" />}
			/>
			<IconButton
				as="a"
				href="#"
				aria-label="Twitter"
				target="_blank"
				icon={<Twitter size="20px" />}
			/>
		</ButtonGroup>
	);
}