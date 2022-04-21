import { createContext, ReactNode } from 'react';
import noop from 'lodash.noop';
import { ToastType } from 'src/types/toast';

export type ContextProps = {
  open: (content: ReactNode | string | number, options?: ToastType) => void
};

const ToastContext = createContext<ContextProps>({ open: noop });

export default ToastContext;
