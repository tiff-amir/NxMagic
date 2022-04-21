import React, { FC, ReactNode, useEffect } from 'react';
import cn from 'classnames';
import { withKeyLayer } from 'key-layers-react';

import { ESC_KEY_CODE } from '@constants/events';

import css from './ContextMenu.module.scss';

export { default as ContextMenuItem } from './Item';

type Props = {
  onClose: () => void
  children: ReactNode
  className?: string
  addKeyListener?: (
    type: string, callback: (e: KeyboardEvent) => void, options?: { code: number },
  ) => void
  removeKeyListener?: (type: string, callback: (e: KeyboardEvent) => void) => void
};

const ContextMenu: FC<Props> = ({ children, onClose, addKeyListener, removeKeyListener, className = '' }: Props) => {
  useEffect(() => {
    const activeElement = document.activeElement as HTMLButtonElement;
    if (activeElement?.blur) activeElement.blur();
  }, []);

  useEffect(() => {
    addKeyListener('keyDown', onClose, { code: ESC_KEY_CODE });
    return () => {
      removeKeyListener('keyDown', onClose);
    };
  }, [addKeyListener, removeKeyListener, onClose]);

  return (
    <div
      className={cn(css.ContextMenu, className)}
      onClick={onClose}
      role="button"
    >
      {children}
    </div>
  );
};

export default withKeyLayer(ContextMenu) as unknown as FC<Props>;
