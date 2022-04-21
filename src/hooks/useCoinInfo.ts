import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AddressType } from 'src/types/contract';
import { getCoinInfoList } from '@ducks/coin/selectors';
import { ADDRESS_PATTERN } from '@constants/patterns';
import { coinFetch } from '@ducks/coin';
import { CoinInfoType } from 'src/types/general';

const useCoinInfo = (query?: string | AddressType, allowAll = false): CoinInfoType[] => {
  const dispatch = useDispatch();
  const processedQuery = query.toLowerCase();
  const coinInfoList = useSelector(getCoinInfoList);
  const result = useMemo(() => {
    if (!processedQuery) return allowAll ? coinInfoList : [];
    return coinInfoList.filter((item) => item.name.toLowerCase().includes(processedQuery)
      || item.symbol.toLowerCase().includes(processedQuery)
      || (/^0(x[0-9a-f]*)?$/i.test(processedQuery) && item.address.toLowerCase().includes(processedQuery)));
  }, [coinInfoList, processedQuery, allowAll]);
  const isAddressQuery = ADDRESS_PATTERN.test(processedQuery);
  useEffect(() => {
    if (isAddressQuery && !result.length) dispatch(coinFetch(processedQuery));
  }, [result, dispatch, processedQuery, isAddressQuery]);
  return result.length ? result : [{
    address: isAddressQuery ? query : '',
    name: '',
    symbol: '',
    decimals: 18,
  }];
};

export default useCoinInfo;
