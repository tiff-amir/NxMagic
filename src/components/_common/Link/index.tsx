import React, { FC, ReactNode } from 'react';
import NextLink from 'next/link';
import cn from 'classnames';

import css from './Link.module.scss';

type Props = {
  id?: string
  className?: string
  blank?: boolean
  href?: string
  to?: string
  children: ReactNode
};

const Link: FC<Props> = ({ id, className, blank, href, to, children }: Props) => {
  if (href) {
    return (
      <a
        id={id}
        className={cn(css.Link, className)}
        target={blank ? '_blank' : undefined}
        rel="noreferrer"
        href={href}
      >
        {children}
      </a>
    );
  }
  if (to) {
    return (
      <NextLink href={to}>
        <a id={id} className={cn(css.Link, className)}>
          {children}
        </a>
      </NextLink>
    );
  }
  return (
    <span id={id} className={cn(css.Link, className)}>
      {children}
    </span>
  );
};

export default Link;
