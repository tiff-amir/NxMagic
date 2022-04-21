import type { TransactionResponse, AddressType, Ether } from 'src/types/contract';
import CommonCoin from '@contracts/CommonCoin';
import { fromWei, toWei } from '@utils/numbers';
import { BigNumber } from 'ethers';
import appConfig from 'appConfig.json';
import type INxMagic from './INxMagic';

export type { default as INxMagic } from './INxMagic';

class NxMagic extends CommonCoin implements INxMagic {
  unlockedBalanceOf = async (account: AddressType): Promise<number> => {
    const decimals = await this.decimals();
    const balance = await this.contract.unlockedBalanceOf(account);
    return fromWei(balance as BigNumber, decimals);
  };

  lockedBalanceOf = async (account: AddressType): Promise<number> => {
    const decimals = await this.decimals();
    const balance = await this.contract.lockedBalanceOf(account);
    return fromWei(balance as BigNumber, decimals);
  };

  increase = async (x: number): Promise<TransactionResponse> => {
    return this.contract.increase(x);
  };

  increaseAfterSomeoneDecrease = async (
    x: number, account: AddressType, overrides?: { value: Ether },
  ): Promise<TransactionResponse> => {
    const args: any = [x, account];
    if (overrides) args.push({ value: toWei(overrides.value, appConfig.token.decimals) });
    return this.contract.increaseAfterSomeoneDecrease(...args);
  };

  decrease = async (
    account: AddressType, overrides?: { value: Ether },
  ): Promise<TransactionResponse> => {
    if (!account) return this.contract['decrease()']();
    const args: any = [account];
    if (overrides) args.push({ value: toWei(overrides.value, appConfig.token.decimals) });
    return this.contract['decrease(address)'](...args);
  };
}

export default NxMagic;
