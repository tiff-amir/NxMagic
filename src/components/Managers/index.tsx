import React, { FC, ReactNode } from 'react';

import ModalManager from './ModalManager';
import ToastManager from './ToastManager';
import ContextMenuManager from './ContextMenuManager';

type Props = {
  children?: ReactNode
};

const Managers: FC<Props> = ({ children }: Props) => (
  <ToastManager>
    <ContextMenuManager>
      <ModalManager>
        {children}
      </ModalManager>
    </ContextMenuManager>
  </ToastManager>
);

export default Managers;
