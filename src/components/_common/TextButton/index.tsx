import React, { FC } from 'react';
import cn from 'classnames';

import StyledButton, { ButtonStyle, ButtonType, CONTAINED_TYPE, REGULAR_STYLE, TEXT_TYPE } from '@common/StyledButton';
import Icon from '@common/Icon';

import css from './TextButton.module.scss';

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
  text: string
  big?: boolean
  disabled?: boolean
  blank?: boolean
  closeIcon?: boolean
  href?: string
  to?: string
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
  className?: string
  id?: string
  icon?: string
};

const TextButton: FC<Props> = (
  {
    id = '',
    className = '',
    big = false,
    type = CONTAINED_TYPE,
    style = REGULAR_STYLE,
    text,
    disabled,
    blank,
    closeIcon = false,
    href,
    to,
    onClick,
    icon,
  }: Props,
) => {
  const isLink = type === LINK_TYPE;
  const isText = type === TEXT_TYPE;
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
      className={cn(css.TextButton, {
        [css['TextButton--link']]: isLink,
        [css['TextButton--text']]: isText,
        [css['TextButton--withIcon']]: icon,
        [css['TextButton--big']]: big,
      }, className)}
    >
      {icon ? (
        <>
          {!closeIcon && (<Icon name={icon} className={css.icon} />)}
          <span>{text}</span>
          {closeIcon && (<Icon name={icon} className={cn(css.icon, { [css['icon--close']]: closeIcon })} />)}
        </>
      ) : text}
    </StyledButton>
  );
};

export default TextButton;
