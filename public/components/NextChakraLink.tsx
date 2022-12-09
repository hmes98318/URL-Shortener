import React, { PropsWithChildren } from 'react';
import NextLink from "next/link";
import { LinkProps as NextLinkProps } from "next/dist/client/link";
import { Link, LinkProps } from "@chakra-ui/react";


export type NextChakraLinkProps = PropsWithChildren<
    NextLinkProps & Omit<LinkProps, "as">
>;


// https://nextjs.org/docs/advanced-features/codemods#name-default-component
export const NextChakraLink = ({ href, as, replace, scroll, shallow, prefetch, children, ...chakraProps }: NextChakraLinkProps) => {
    return (
        <NextLink
            passHref={true}
            href={href}
            as={as}
            replace={replace}
            scroll={scroll}
            shallow={shallow}
            prefetch={prefetch}
            target={"_blank"}
        >
            <Link
                _hover={{ textDecoration: "none" }}
                _focus={{ boxShadow: "none" }}
                _focusVisible={{ boxShadow: "outline" }}
                {...chakraProps}
            >
                {children}
            </Link>
        </NextLink>
    );
};