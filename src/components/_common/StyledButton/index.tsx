import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import { ButtonStyle, ButtonType } from '@common/StyledButton/types';
import StyledButtonContained from '@common/StyledButton/StyledButtonContained';
import StyledButtonOutline from '@common/StyledButton/StyledButtonOutline';
import StyledButtonText from '@common/StyledButton/StyledButtonText';
import { CONTAINED_TYPE, MAIN_STYLE, OUTLINE_TYPE, TEXT_TYPE } from '@common/StyledButton/constants';

import css from './StyledButton.module.scss';

export {
  CONTAINED_TYPE,
  TEXT_TYPE,
  OUTLINE_TYPE,
  REGULAR_STYLE,
  MAIN_STYLE,
  SECONDARY_STYLE,
  DANGER_STYLE,
} from './constants';

export type { ButtonType, ButtonStyle } from './types';

type Props = {
  type: ButtonType
  style?: ButtonStyle
  disabled?: boolean
  blank?: boolean
  href?: string
  to?: string
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
  className?: string
  id?: string
  children: ReactNode
};

const StyledButton: FC<Props> = (
  { id = '', className = '', type, style = MAIN_STYLE, children, disabled, blank, href, to, onClick }: Props,
) => {
  const Comp = {
    [CONTAINED_TYPE]: StyledButtonContained,
    [OUTLINE_TYPE]: StyledButtonOutline,
    [TEXT_TYPE]: StyledButtonText,
  }[type];
  return Comp ? (
    <Comp
      className={cn(css.StyledButton, className)}
      style={style}
      disabled={disabled}
      blank={blank}
      href={href}
      to={to}
      onClick={onClick}
      id={id}
    >
      {children}
    </Comp>
  ) : null;
};

export default StyledButton;
