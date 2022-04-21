import React, { FC } from 'react';
import cn from 'classnames';

import useTranslation from '@hooks/useTranslation';
import Button, { CONTAINED_TYPE, TEXT_TYPE } from '@common/TextButton';
import Link from '@common/Link';
import BaseModal from '../BaseModal';

import css from './BuyTokenModal.module.scss';

type Props = {
  ido: string
  whitepaper: string
  onClose: () => void
};

const BuyTokenModal: FC<Props> = ({ ido, whitepaper, onClose }: Props) => {
  const { t } = useTranslation();
  return (
    <BaseModal
      className={css.BuyTokenModal}
      title={t('BuyTokenModal.title')}
      onClose={onClose}
      buttons={(
        <>
          <Button className={css.button} type={TEXT_TYPE} onClick={onClose} text={t('_common.close')} />
          <Button
            blank
            onClick={onClose}
            className={cn(css.button, css['button--last'])}
            type={CONTAINED_TYPE}
            href={ido}
            text={t('BuyTokenModal.buy')}
          />
        </>
      )}
    >
      <div className={css.content}>
        <div>
          <span>{t('BuyTokenModal.description.0')}</span>
          <Link blank href={ido}>{t('BuyTokenModal.description.1')}</Link>
        </div>
        <div className={css.block}>
          <span>{t('BuyTokenModal.details.0')}</span>
          <Link blank href={whitepaper}>{t('BuyTokenModal.details.1')}</Link>
        </div>
      </div>
    </BaseModal>
  );
};

export default BuyTokenModal;
