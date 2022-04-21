import React, { FC, ReactNode, useEffect } from 'react';
import { withKeyLayer } from 'key-layers-react';
import cn from 'classnames';
import noop from 'lodash.noop';

import { stopPropagation } from '@utils/events';
import { ESC_KEY_CODE, ENTER_KEY_CODE } from '@constants/events';

import css from './BaseModal.module.scss';

type Props = {
  className?: string
  title?: string
  children: ReactNode
  buttons?: ReactNode
  onClose?: () => void
  onSubmit?: () => void
  bgClose?: boolean
  escClose?: boolean
  addKeyListener?: (
    type: string, callback: (e: KeyboardEvent) => void, options?: { code: number },
  ) => void
};

const BaseModal: FC<Props> = (
  {
    className = '',
    title = '',
    children,
    buttons,
    onClose,
    onSubmit,
    escClose = true,
    bgClose = true,
    addKeyListener = noop,
  }: Props,
) => {
  useEffect(() => {
    const activeElement = document.activeElement as HTMLButtonElement;
    if (activeElement?.blur) activeElement.blur();
  }, []);
  useEffect(() => {
    if (escClose) addKeyListener('keyDown', onClose, { code: ESC_KEY_CODE });
    if (onSubmit) addKeyListener('keyDown', onSubmit, { code: ENTER_KEY_CODE });
  }, [escClose, addKeyListener, onClose, onSubmit]);
  return (
    <div className={css.overlay} role="button" onClick={(bgClose ? onClose : noop) || noop}>
      <div className={cn(css.BaseModal, className)} role="button" onClick={stopPropagation}>
        {title && (
          <div className={css.title}>
            <span className={css.titleText}>{title}</span>
          </div>
        )}
        <div className={css.content}>
          {children}
        </div>
        {buttons ? (
          <div className={css.buttons}>
            {buttons}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default withKeyLayer(BaseModal) as unknown as FC<Props>;
