import React, { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import ContextMenu from '@common/ContextMenu';

import ContextMenuContext, { ContextMenuOptionsType } from '@context/contextMenu';

type Props = {
  children?: ReactNode
  addKeyListener?: (
    type: string, callback: (e: KeyboardEvent) => void, options?: { code: number },
  ) => void
};

const ContextMenuManager: FC<Props> = ({ children, addKeyListener }: Props) => {
  const [
    contextMenu, setContextMenu,
  ] = useState<{ list: ReactNode[], options: ContextMenuOptionsType } | undefined>();

  const closeHandler = useCallback(() => {
    if (contextMenu?.options?.onClose) contextMenu.options.onClose();
    setContextMenu(undefined);
  }, [contextMenu]);

  useEffect(() => {
    document.body.addEventListener('click', closeHandler);
    return () => {
      document.body.removeEventListener('click', closeHandler);
    };
  }, [closeHandler, addKeyListener]);

  const target = contextMenu?.options?.target
    ? document.querySelector(`#${contextMenu.options.target}`) : undefined;
  const openHandler = useCallback((list: ReactNode[], options: ContextMenuOptionsType) => {
    setContextMenu({ list, options });
  }, []);
  const contextMenuValue = useMemo(() => ({
    open: openHandler, close: closeHandler,
  }), [openHandler, closeHandler]);

  return (
    <ContextMenuContext.Provider value={contextMenuValue}>
      {children}
      {contextMenu && target && createPortal((
        <ContextMenu
          onClose={closeHandler}
          className={contextMenu.options.className}
        >
          {contextMenu.list}
        </ContextMenu>
      ), target)}
    </ContextMenuContext.Provider>
  );
};

export default ContextMenuManager;
