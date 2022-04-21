import React, { FC, useCallback } from 'react';
import cn from 'classnames';

import Icon from '@common/Icon';

import css from './ContextMenuItem.module.scss';

type Props = {
  className?: string
  icon?: string
  text: string
  onClick: () => void
};

const ContextMenuItem: FC<Props> = ({ className = '', icon, text, onClick }: Props) => {
  const clickHandler = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <div
      role="button"
      onClick={clickHandler}
      className={cn(
        css.ContextMenuItem,
        { [css['ContextMenuItem--withIcon']]: Boolean(icon) },
        className,
      )}
    >
      {icon && <Icon name={icon} />}
      <div>{text}</div>
    </div>
  );
};

export default ContextMenuItem;
