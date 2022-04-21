import React, { FC } from 'react';

import useTranslation from '@hooks/useTranslation';
import TextButton from '@common/TextButton';
import { ROOT } from '@constants/routing';

import css from './NotFound.module.scss';

const NotFoundPage: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className={css.title}>
        <span className={css.titleText}>{t('NotFoundPage.title')}</span>
      </div>
      <div className={css.description}>
        <span className={css.descriptionText}>{t('NotFoundPage.description')}</span>
      </div>
      <div className={css.mainLinkContainer}>
        <TextButton className={css.mainLink} text={t('NotFoundPage.main')} to={ROOT} />
      </div>
    </>
  );
};

export default NotFoundPage;
