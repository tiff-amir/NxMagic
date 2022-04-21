import React, { FC } from 'react';

import useTranslation from '@hooks/useTranslation';
import Button, { OUTLINE_TYPE, TEXT_TYPE } from '@common/TextButton';
import BaseModal from '../BaseModal';

import css from './ConnectWalletModal.module.scss';

type Props = {
  disabled: boolean
  onClose: () => void
  onMetaMask?: () => void
  onWalletConnect?: () => void
};

const ConnectWalletModal: FC<Props> = (
  { disabled, onClose, onMetaMask, onWalletConnect }: Props,
) => {
  const { t } = useTranslation();
  return (
    <BaseModal
      className={css.ConnectWalletModal}
      title={t('ConnectWalletModal.title')}
      onClose={onClose}
      buttons={(
        <Button type={TEXT_TYPE} onClick={onClose} text={t('_common.close')} />
      )}
    >
      <div className={css.buttons}>
        <Button
          disabled={disabled}
          className={css.button}
          type={OUTLINE_TYPE}
          icon="metamask"
          text={t('_common.metamask')}
          onClick={onMetaMask}
        />
        <Button
          disabled={disabled}
          className={css.button}
          type={OUTLINE_TYPE}
          icon="walletconnect"
          text={t('_common.walletConnect')}
          onClick={onWalletConnect}
        />
      </div>
    </BaseModal>
  );
};

export default ConnectWalletModal;
