import React, { FC } from 'react';
import cn from 'classnames';

import Icon from '@common/Icon';
import StyledButton, { ButtonStyle, ButtonType, CONTAINED_TYPE, REGULAR_STYLE, TEXT_TYPE } from '@common/StyledButton';

import css from './IconButton.module.scss';

export {
  CONTAINED_TYPE,
  TEXT_TYPE,
  OUTLINE_TYPE,
  REGULAR_STYLE,
  MAIN_STYLE,
  SECONDARY_STYLE,
  DANGER_STYLE,
} from '@common/StyledButton';

export const LINK_TYPE = 'link';

type Props = {
  type?: ButtonType | 'link'
  style?: ButtonStyle
  name: string
  disabled?: boolean
  blank?: boolean
  href?: string
  to?: string
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
  className?: string
  id?: string
};

const IconButton: FC<Props> = (
  { id = '', className = '', type = CONTAINED_TYPE, style = REGULAR_STYLE, name, disabled, blank, href, to, onClick }: Props,
) => {
  const isLink = type === LINK_TYPE;
  return (
    <StyledButton
      id={id}
      type={isLink ? TEXT_TYPE : type}
      style={style}
      disabled={disabled}
      blank={blank}
      href={href}
      to={to}
      onClick={onClick}
      className={cn(css.IconButton, className)}
    >
      <Icon name={name} className={css.icon} />
    </StyledButton>
  );
};

export default IconButton;
