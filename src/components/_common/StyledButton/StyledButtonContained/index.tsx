import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import { ButtonStyle } from '@common/StyledButton/types';
import BaseButton from '@common/BaseButton';
import { DANGER_STYLE, MAIN_STYLE, REGULAR_STYLE, SECONDARY_STYLE } from '@common/StyledButton/constants';

import css from './StyledButtonContained.module.scss';

type Props = {
  style: ButtonStyle
  disabled?: boolean
  blank?: boolean
  href?: string
  to?: string
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
  className?: string
  id?: string
  children: ReactNode
};

const StyledButtonContained: FC<Props> = (
  { id = '', className = '', style, children, disabled, blank, href, to, onClick }: Props,
) => {
  const styleClassName = {
    [REGULAR_STYLE]: css['StyledButtonContained--regular'],
    [MAIN_STYLE]: css['StyledButtonContained--main'],
    [SECONDARY_STYLE]: css['StyledButtonContained--secondary'],
    [DANGER_STYLE]: css['StyledButtonContained--danger'],
  }[style];
  return (
    <BaseButton
      id={id}
      disabled={disabled}
      blank={blank}
      href={href}
      to={to}
      onClick={onClick}
      className={cn(css.StyledButtonContained, styleClassName, {
        [css['StyledButtonContained--disabled']]: disabled,
      }, className)}
    >
      {children}
    </BaseButton>
  );
};

export default StyledButtonContained;
