import React, { FC } from 'react';
import cn from 'classnames';

import Icon from '@common/Icon';
import StyledButton, { TEXT_TYPE, REGULAR_STYLE } from '@common/StyledButton';
import useTranslation from '@hooks/useTranslation';

import css from './SocialItemsHorizontal.module.scss';

type Props = {
  className?: string
  telegramHref?: string
  twitterHref?: string
  redditHref?: string
};

const SocialItemsHorizontal: FC<Props> = ({ className = '', telegramHref, twitterHref, redditHref }: Props) => {
  const { t } = useTranslation();
  return (
    <div className={cn(css.SocialItemsHorizontal, className)}>
      {telegramHref && (
        <div className={css.linkContainer}>
          <StyledButton
            blank
            style={REGULAR_STYLE}
            type={TEXT_TYPE}
            className={css.link}
            href={telegramHref}
          >
            <Icon className={css.icon} name="telegram" />
            <div className={css.label}>{t('_common.telegram')}</div>
          </StyledButton>
        </div>
      )}
      {twitterHref && (
        <div className={css.linkContainer}>
          <StyledButton
            blank
            style={REGULAR_STYLE}
            type={TEXT_TYPE}
            className={css.link}
            href={twitterHref}
          >
            <Icon className={css.icon} name="twitter" />
            <div className={css.label}>{t('_common.twitter')}</div>
          </StyledButton>
        </div>
      )}
      {redditHref && (
        <div className={css.linkContainer}>
          <StyledButton
            blank
            style={REGULAR_STYLE}
            type={TEXT_TYPE}
            className={css.link}
            href={redditHref}
          >
            <Icon className={css.icon} name="reddit" />
            <div className={css.label}>{t('_common.reddit')}</div>
          </StyledButton>
        </div>
      )}
    </div>
  );
};

export default SocialItemsHorizontal;
