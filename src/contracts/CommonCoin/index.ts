import { BigNumber } from 'ethers';

import { TransactionResponse, AddressType, Ether } from 'src/types/contract';
import { fromWei, toWei } from '@utils/numbers';
import type ICommonCoin from './ICommonCoin';
import BaseContract from '../BaseContract';

export type { default as ICommonCoin } from './ICommonCoin';

class CommonCoin extends BaseContract implements ICommonCoin {
  name = async (): Promise<string> => {
    const name = await this.contract.name();
    return name as string;
  };

  symbol = async (): Promise<string> => {
    const symbol = await this.contract.symbol();
    return symbol as string;
  };

  decimals = async (): Promise<number> => {
    const decimals = await this.contract.decimals();
    return decimals as number;
  };

  balanceOf = async (account: AddressType): Promise<number> => {
    const decimals = await this.decimals();
    const balance = await this.contract.balanceOf(account);
    return fromWei(balance as BigNumber, decimals);
  };

  allowance = async (owner: AddressType, spender: AddressType): Promise<number> => {
    const decimals = await this.decimals();
    const allowance = await this.contract.allowance(owner, spender);
    return fromWei(allowance as BigNumber, decimals);
  };

  approve = async (spender: AddressType, amount: Ether): Promise<TransactionResponse> => {
    const decimals = await this.decimals();
    return this.contract.approve(spender, toWei(amount, decimals));
  };
}

export default CommonCoin;
