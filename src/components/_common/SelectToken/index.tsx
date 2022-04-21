import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import noop from 'lodash.noop';
import cn from 'classnames';

import Icon from '@common/Icon';
import TokenIcon from '@common/TokenIcon';
import SelectTokenModal from '@presentation/_modals/SelectToken';
import useCoinInfo from '@hooks/useCoinInfo';
import useTranslation from '@hooks/useTranslation';
import { ADDRESS_PATTERN } from '@constants/patterns';
import ModalContext from '@context/modal';
import { AddressType } from 'src/types/contract';
import { CoinInfoType } from 'src/types/general';

import css from './SelectToken.module.scss';

type Props = {
  address?: AddressType
  emptyLabel?: string
  className?: string
  onChange?: (address: string) => void
};

const SelectToken: FC<Props> = ({ address: addressInit, emptyLabel, className = '', onChange = noop }: Props) => {
  const [address, setAddress] = useState(ADDRESS_PATTERN.test(addressInit) ? addressInit : '');
  const { open, close } = useContext(ModalContext);
  const { t } = useTranslation();
  const coinInfoList = useCoinInfo(ADDRESS_PATTERN.test(address) ? address : '');
  const { symbol, address: addressInfo } = coinInfoList[0];

  useEffect(() => {
    onChange(addressInfo);
  }, [onChange, addressInfo]);

  const setHandler = useCallback((coinInfo: CoinInfoType) => {
    setAddress(coinInfo.address);
  }, []);

  const clickHandler = useCallback(() => {
    const id = open(
      <SelectTokenModal
        onSet={(coinInfo: CoinInfoType) => {
          setHandler(coinInfo);
          close(id);
        }}
        onClose={() => close(id)}
      />,
    );
  }, [close, open, setHandler]);

  return (
    <button onClick={clickHandler} type="button" className={cn(css.SelectToken, className)}>
      {addressInfo ? (
        <>
          <TokenIcon
            className={css.icon}
            address={addressInfo}
          />
          <div>
            <span>{symbol}</span>
          </div>
        </>
      ) : (
        <div>
          <span className={css.emptyText}>{emptyLabel || t('SelectToken.emptyLabel')}</span>
        </div>
      )}
      <Icon className={css.arrow} name="chevron-down" />
    </button>
  );
};

export default SelectToken;
