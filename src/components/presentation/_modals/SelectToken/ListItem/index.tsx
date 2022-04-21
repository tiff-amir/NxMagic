import React, { FC, useCallback } from 'react';

import { CoinInfoType } from 'src/types/general';
import TokenIcon from '@common/TokenIcon';

import css from './ListItem.module.scss';

type Props = {
  style?: { [key: string]: string }
  coinInfo: CoinInfoType
  onClick: (coinInfo: CoinInfoType) => void
};

const SelectTokenListItem: FC<Props> = ({ coinInfo, onClick, style = {} }: Props) => {
  const clickHandler = useCallback(() => {
    onClick(coinInfo);
  }, [coinInfo, onClick]);
  return (
    <div style={style} className={css.SelectTokenListItem}>
      <button onClick={clickHandler} type="button" className={css.button}>
        <TokenIcon
          className={css.icon}
          address={coinInfo.address}
        />
        <div>
          <span>{coinInfo.symbol}</span>
        </div>
        <div className={css.name}>
          <span>{coinInfo.name}</span>
        </div>
      </button>
    </div>
  );
};

export default SelectTokenListItem;
