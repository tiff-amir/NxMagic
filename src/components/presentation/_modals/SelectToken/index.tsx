import React, { FC, useState, useCallback, ChangeEvent } from 'react';

import Input from '@common/Input';
import VirtualizedList from '@common/VirtualizedList';
import BaseModal from '@presentation/_modals/BaseModal';
import useTranslation from '@hooks/useTranslation';
import { CoinInfoType } from 'src/types/general';
import useCoinInfo from '@hooks/useCoinInfo';
import ListItem from './ListItem';

import css from './SelectToken.module.scss';

type Props = {
  onSet: (address: CoinInfoType) => void
  onClose: () => void
};

const SelectToken: FC<Props> = ({ onSet, onClose }: Props) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const coinInfoList = useCoinInfo(query, true);

  const changeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
  }, []);

  const clickHandler = useCallback((coinInfo: CoinInfoType) => {
    onSet(coinInfo);
  }, [onSet]);

  const rowRender = useCallback((params: { index: number, style: { [key: string]: string } }) => {
    const item = coinInfoList[params.index];
    return (
      <ListItem style={params.style} onClick={clickHandler} coinInfo={item} />
    );
  }, [clickHandler, coinInfoList]);

  return (
    <BaseModal
      className={css.modal}
      onClose={onClose}
      title={t('SelectToken.title')}
    >
      <div className={css.SelectToken}>
        <Input
          placeholder={t('SelectToken.placeholder')}
          onChange={changeHandler}
          value={query}
        />
        <VirtualizedList
          itemCount={coinInfoList.length}
          rowRender={rowRender}
          className={css.list}
        />
      </div>
    </BaseModal>
  );
};

export default SelectToken;
