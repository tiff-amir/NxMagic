import React, { FC } from 'react';
import cn from 'classnames';

import IconButton, { TEXT_TYPE } from '@common/IconButton';

import css from './SocialItemsVertical.module.scss';

type Props = {
  className?: string
  telegramHref?: string
  twitterHref?: string
  redditHref?: string
};

const SocialItemsVertical: FC<Props> = ({ className = '', telegramHref, twitterHref, redditHref }: Props) => {
  return (
    <div className={cn(css.SocialItemsVertical, className)}>
      {telegramHref && <IconButton type={TEXT_TYPE} blank className={css.link} name="telegram" href={telegramHref} />}
      {twitterHref && <IconButton type={TEXT_TYPE} blank className={css.link} name="twitter" href={twitterHref} />}
      {redditHref && <IconButton type={TEXT_TYPE} blank className={css.link} name="reddit" href={redditHref} />}
    </div>
  );
};

export default SocialItemsVertical;
