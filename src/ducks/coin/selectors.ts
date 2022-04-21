import { createSelector } from 'reselect';

import { CoinInfoType } from 'src/types/general';
import StateType from '@ducks/StateType';
import { AddressType } from 'src/types/contract';

export const getCoinInfo = (state: StateType, address: AddressType): CoinInfoType | undefined => {
  return state.coin.data[address.toLowerCase()];
};

export const getCoinInfoMap = (state: StateType): { [key: string]: CoinInfoType } => {
  return state.coin.data;
};

export const getCoinInfoList = createSelector(
  getCoinInfoMap,
  (map): CoinInfoType[] => {
    return Object.keys(map).map((key) => map[key]);
  },
);

export const checkFetching = (state: StateType, address: AddressType): boolean => {
  return state.coin.fetchingList.includes(address.toLowerCase());
};
