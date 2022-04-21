import React, { FC } from 'react';
import cn from 'classnames';

import css from './Icon.module.scss';

type Props = {
  name: string
  className?: string
};

const Icon: FC<Props> = ({ name, className = '' }: Props) => (
  <div className={cn(css.Icon, className)}>
    <svg className={css.svg} focusable={false}>
      <use href={`#${name}`} />
    </svg>
  </div>
);

export default Icon;
