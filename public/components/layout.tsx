import React from 'react';
import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Head from 'next/head';

import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';


interface IProps {
	children: ReactNode
}

export const Layout = ({ children }: IProps) => {
	return (
		<>
			<Head>
				<title>URL-Shortener</title>
        		<link rel="icon" href="../images/favicon.ico" />
			</Head>
			<Box>
				<Header />
				<Box
					as="main"
					mx="auto"
					minH="73vh"
					py="3"
				>
					{children}
				</Box>
				<Footer />
			</Box>
		</>
	);
}