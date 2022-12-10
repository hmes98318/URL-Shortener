import React, { PropsWithChildren } from 'react';
import { LinkProps as NextLinkProps } from "next/dist/client/link";
import { Link, LinkProps } from "@chakra-ui/react";


export type NextChakraLinkProps = PropsWithChildren<
    NextLinkProps & Omit<LinkProps, "as">
>;


// https://nextjs.org/docs/advanced-features/codemods#name-default-component
export const NextChakraLink = ({ href, color, children }: NextChakraLinkProps) => {
    return (
        <Link
            href={href}
            target={"_blank"}
            color={color}
            _hover={{ textDecoration: "none" }}
            _focus={{ boxShadow: "none" }}
            _focusVisible={{ boxShadow: "outline" }}
        >
            {children}
        </Link>
    );
};