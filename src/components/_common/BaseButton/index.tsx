import React, { FC, ReactNode } from 'react';
import NextLink from 'next/link';
import cn from 'classnames';

import css from './BaseButton.module.scss';

type Props = {
  disabled?: boolean
  blank?: boolean
  href?: string
  to?: string
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
  className?: string
  id?: string
  children: ReactNode
};

const BaseButton: FC<Props> = (
  { id = '', className = '', to, href, children, blank = false, disabled = false, onClick }: Props,
) => {
  const fullClassName = cn(css.BaseButton, {
    [css['BaseButton--disabled']]: disabled,
  }, className);

  if (href && !disabled) {
    return (
      <a
        id={id}
        onClick={onClick}
        className={fullClassName}
        target={blank ? '_blank' : undefined}
        rel="noreferrer"
        href={href}
      >
        {children}
      </a>
    );
  }

  if (to && !disabled) {
    return (
      <NextLink href={to}>
        <a id={id} className={fullClassName}>
          {children}
        </a>
      </NextLink>
    );
  }

  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={fullClassName}
    >
      {children}
    </button>
  );
};

export default BaseButton;
