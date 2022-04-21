import React, { FC, ReactNode, useCallback, useEffect, useRef } from 'react';

import useUnit from '@hooks/useUnit';

import css from './PageWrapper.module.scss';

type Props = {
  children: ReactNode
};

const PageWrapper: FC<Props> = ({ children }: Props) => {
  const root = useRef<HTMLDivElement>();
  const content = useRef<HTMLDivElement>();
  const unit = useUnit();

  const resizeHandler = useCallback(() => {
    if (root.current && content.current) {
      const rootHeight = root.current.offsetHeight;
      const contentHeight = content.current.offsetHeight;
      const padding = (rootHeight - contentHeight) / 2 / unit;
      root.current.style.setProperty('--container-height-vertical-padding', `${padding}`);
    }
  }, [unit]);

  resizeHandler();
  useEffect(() => {
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [resizeHandler]);

  return (
    <div ref={root} className={css.PageWrapper}>
      {children}
    </div>
  );
};

export default PageWrapper;
