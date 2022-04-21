import { AddressType } from 'src/types/contract';

export type StoreActionType<T> = {
  type: string
  payload: T
};

export type ContractType = { [key: string]: (...args: any[]) => Promise<any> } & {
  resolvedAddress: Promise<string>
};

export type CoinInfoType = {
  name: string
  symbol: string
  decimals: number
  address: AddressType
};
