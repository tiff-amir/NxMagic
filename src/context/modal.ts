import { createContext, ReactNode } from 'react';
import noop from 'lodash.noop';

export type ContextProps = {
  open: (
    modal: ReactNode,
    options?: {
      id?: string
      info?: string
    },
  ) => string
  close: (id: string) => void
};

const ModalContext = createContext<ContextProps>({ open: () => '', close: noop });

export default ModalContext;
