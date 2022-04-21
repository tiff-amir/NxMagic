import React, { FC } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import cn from 'classnames';

import css from './Loader.module.scss';

type Props = {
  style?: { [key: string]: string }
  className?: string
};

const Loader: FC<Props> = ({ className = '', style = {} }: Props) => {
  return (
    <div style={style} className={cn(css.Loader, className)}>
      <ClipLoader />
    </div>
  );
};

export default Loader;
