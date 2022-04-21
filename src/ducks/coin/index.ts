import { createActions, handleActions } from 'redux-actions';

import tokens from '@_data/tokens.json';
import appConfig from 'appConfig.json';
import { AddressType } from 'src/types/contract';
import { CoinInfoType } from 'src/types/general';

export const FETCH = 'coin@FETCH';
export const FETCH_START = 'coin@FETCH_START';
export const FETCH_FINISHED = 'coin@FETCH_FINISHED';
export const ADD = 'coin@ADD';

const ROOT_COIN: CoinInfoType = {
  name: appConfig.token.name,
  symbol: appConfig.token.symbol,
  decimals: appConfig.token.decimals,
  address: appConfig.token.address,
};

export const {
  coinAdd,
  coinFetch,
  coinFetchStart,
  coinFetchFinished,
} = createActions(
  ADD,
  FETCH,
  FETCH_START,
  FETCH_FINISHED,
);

export type StateType = {
  fetchingList: string[],
  data: { [key: string]: CoinInfoType }
};

export const whiteList = [
  'metamask.data',
];

export const defaultState: StateType = {
  fetchingList: [],
  data: tokens.reduce((acc, item) => {
    acc[item.address.toLowerCase()] = {
      name: item.name,
      address: item.address,
      symbol: item.symbol,
      decimals: item.decimals as number,
    };
    return acc;
  }, { [ROOT_COIN.address.toLowerCase()]: ROOT_COIN } as { [key: string]: CoinInfoType }),
};

export default handleActions({
  [FETCH_START]: (state: StateType, { payload }: { payload: AddressType }): StateType => {
    const address = payload.toLowerCase();
    return {
      ...state,
      fetchingList: state.fetchingList.includes(address)
        ? state.fetchingList : [...state.fetchingList, address],
    };
  },
  [FETCH_FINISHED]: (state: StateType, { payload }: { payload: AddressType }): StateType => {
    const address = payload.toLowerCase();
    return {
      ...state,
      fetchingList: state.fetchingList.includes(address)
        ? state.fetchingList.filter((item) => item !== address) : state.fetchingList,
    };
  },
  [ADD]: (state: StateType, { payload }: { payload: CoinInfoType }): StateType => ({
    ...state,
    data: {
      ...state.data,
      [payload.address.toLowerCase()]: payload,
    },
  }),
}, defaultState);
