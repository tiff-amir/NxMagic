import React, { FC, useEffect, useRef, useState, useCallback, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import noop from 'lodash.noop';
import cn from 'classnames';

import { AddressType } from 'src/types/contract';
import Input from '@common/Input';
import useTranslation from '@hooks/useTranslation';
import { getCoinInfo, getCoinInfoList } from '@ducks/coin/selectors';
import { coinFetch } from '@ducks/coin';
import TokenIcon from '@common/TokenIcon';
import { ADDRESS_PATTERN } from '@constants/patterns';
import StateType from '@ducks/StateType';
import { CoinInfoType } from 'src/types/general';

import css from './AddressInput.module.scss';

type Props = {
  className?: AddressType
  address?: AddressType
  name?: string
  label?: string
  error?: string
  placeholder?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
};

const AddressInput: FC<Props> = (
  {
    error = '',
    className = '',
    name = '',
    label = '',
    placeholder = '',
    address: initialAddress = '',
    onChange = noop,
  }: Props,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [autoCompleteList, setCompleteList] = useState<CoinInfoType[]>([]);
  const [address, setAddress] = useState<AddressType>(initialAddress);
  const coinInfo = useSelector<StateType, CoinInfoType | undefined>(
    (state) => getCoinInfo(state, address),
  );
  const coinInfoList = useSelector(getCoinInfoList);
  const mounted = useRef<boolean>();
  useEffect(() => {
    if (mounted.current) setAddress(initialAddress);
    mounted.current = true;
  }, [initialAddress]);

  useEffect(() => {
    if (ADDRESS_PATTERN.test(address) && !coinInfo) {
      dispatch(coinFetch(address));
    }
  }, [address, coinInfo, dispatch]);

  useEffect(() => {
    if (!coinInfo && !ADDRESS_PATTERN.test(address) && address) {
      const checkString = address.toLowerCase();
      setCompleteList(coinInfoList.filter((item) => {
        return item.name.toLowerCase().includes(checkString)
          || item.symbol.toLowerCase().includes(checkString);
      }));
    }
  }, [coinInfoList, coinInfo, address]);

  const changeHandler = useCallback((e) => {
    const { value } = e.target;
    setAddress(value);
    onChange(value);
  }, [onChange]);

  return (
    <div className={cn(css.AddressInput, className)}>
      <Input
        name={name}
        prepend={<TokenIcon address={coinInfo?.address} />}
        append={<div className={css.symbol}>{coinInfo?.symbol || ''}</div>}
        error={error}
        onChange={changeHandler}
        label={label}
        placeholder={placeholder || t('AddressInput.placeholder')}
        value={coinInfo?.name || address}
      />
      {autoCompleteList.length ? (
        <ul className={css.autoCompleteList}>
          {autoCompleteList.map((item) => (
            <li key={item.address} className={css.autoCompleteList__item}>
              <TokenIcon address={item.address} />
              <div className={css.autoCompleteList__itemSymbol}>{item.symbol}</div>
              <div className={css.autoCompleteList__itemName}>{item.name}</div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default AddressInput;
