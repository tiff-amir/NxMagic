import { Store } from 'redux';

import { CoinInfoType, ContractType } from 'src/types/general';
import { AddressType } from 'src/types/contract';
import { getCoinInfo } from '@ducks/coin/selectors';
import { NO_IMPLEMENTATION_ERROR } from '@constants/errors';
import { coinAdd } from '@ducks/coin';
import IBaseContract from './IBaseContract';

class BaseContract implements IBaseContract {
  static async fetchCoinInfo(address: AddressType): Promise<CoinInfoType> {
    console.log('error on get info: ', address);
    throw new Error(NO_IMPLEMENTATION_ERROR);
  }

  protected readonly contract: ContractType;

  protected readonly store: Store;

  constructor(contract: ContractType, store: Store) {
    this.contract = contract;
    this.store = store;
  }

  resolvedAddress = async (): Promise<string> => {
    return this.contract.resolvedAddress;
  };

  getDecimals = async (address: AddressType): Promise<number> => {
    let coinInfo = getCoinInfo(this.store.getState(), address);
    if (coinInfo) return coinInfo.decimals;
    coinInfo = await BaseContract.fetchCoinInfo(address);
    this.store.dispatch(coinAdd(coinInfo));
    return coinInfo.decimals;
  };
}

export default BaseContract;
