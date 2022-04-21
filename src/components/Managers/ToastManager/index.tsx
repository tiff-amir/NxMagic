import React, { FC, ReactNode, useCallback, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import ToastContext from '@context/toast';
import { ToastType } from 'src/types/toast';
import { AUTO_CLOSE_DURATION, DEFAULT_POSITION } from '@constants/toast';

import css from './ToastManager.module.scss';

type Props = {
  children?: ReactNode
};

const ToastManager: FC<Props> = ({ children }: Props) => {
  const openHandler = useCallback((content: ReactNode | string | number, options?: ToastType) => {
    toast(content, {
      className: css.toast,
      hideProgressBar: true,
      position: DEFAULT_POSITION,
      autoClose: options?.autoClose || AUTO_CLOSE_DURATION,
      type: options?.type,
    });
  }, []);
  const toastValue = useMemo(() => ({ open: openHandler }), [openHandler]);
  return (
    <ToastContext.Provider value={toastValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export default ToastManager;
