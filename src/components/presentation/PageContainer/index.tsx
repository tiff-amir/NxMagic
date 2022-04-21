import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import css from './PageContainer.module.scss';

type Props = {
  name: string
  children: ReactNode;
  className?: string
};

const PageContainer: FC<Props> = ({ className = '', name, children }: Props) => {
  return (
    <div
      className={cn(css.PageContainer, className)}
    >
      <div className={css.name}>
        {name}
      </div>
      <div className={css.content}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
