import React, { FC, useCallback } from 'react';
import cn from 'classnames';

import useTranslation from '@hooks/useTranslation';
import Input from '@common/Input';
import Button, { CONTAINED_TYPE, TEXT_TYPE } from '@common/TextButton';
import { AddressType } from 'src/types/contract';
import BaseModal from '../BaseModal';

import css from './DecreaseModal.module.scss';

type Props = {
  ownAddress: string
  address: string
  isDecreasing: boolean
  withFee: boolean
  onClose: () => void
  onDecrease: () => void
  onChange: (value: AddressType) => void
  isAddressIncorrect: boolean
  decreaseFee: number
  rootSymbol: string
};

const DecreaseModal: FC<Props> = (
  {
    ownAddress,
    address,
    isDecreasing,
    withFee,
    onClose,
    onDecrease,
    onChange,
    isAddressIncorrect,
    decreaseFee,
    rootSymbol,
  }: Props,
) => {
  const { t } = useTranslation();

  const addressChangeHandler = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <BaseModal
      className={css.DecreaseModal}
      title={t('DecreaseModal.title')}
      onClose={onClose}
      buttons={(
        <>
          <Button className={css.button} type={TEXT_TYPE} onClick={onClose} text={t('_common.close')} />
          <Button
            blank
            disabled={isDecreasing}
            onClick={onDecrease}
            className={cn(css.button, css['button--last'])}
            type={CONTAINED_TYPE}
            text={t('DecreaseModal.decrease')}
          />
        </>
      )}
    >
      <Input
        spellcheck={false}
        placeholder={ownAddress}
        onChange={addressChangeHandler}
        lock={isDecreasing}
        label={t('DecreaseModal.inputLabel')}
        value={address}
        warning={withFee ? t('DecreaseModal.decreaseFee', {
          value: decreaseFee, symbol: rootSymbol,
        }) : undefined}
        error={isAddressIncorrect ? t('_errors.address') : undefined}
      />
    </BaseModal>
  );
};

export default DecreaseModal;
