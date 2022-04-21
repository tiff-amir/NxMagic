import { createContext, ReactNode } from 'react';
import noop from 'lodash.noop';

export type ContextMenuOptionsType = {
  target: string
  onClose?: () => void
  className: string
};

export type ContextProps = {
  open: (content: ReactNode[], options: ContextMenuOptionsType) => void
  close: () => void
};

const ContextMenuContext = createContext<ContextProps>({ open: noop, close: noop });

export default ContextMenuContext;
