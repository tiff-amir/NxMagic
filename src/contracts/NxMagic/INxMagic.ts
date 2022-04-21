import type { TransactionResponse, AddressType, Ether } from 'src/types/contract';
import { ICommonCoin } from '@contracts/CommonCoin';

export default interface INxMagic extends ICommonCoin {
  increase(x: number): Promise<TransactionResponse>;
  increaseAfterSomeoneDecrease(
    x: number, account: AddressType, overrides?: { value: Ether },
  ): Promise<TransactionResponse>;
  decrease(account?: AddressType, overrides?: { value: Ether }): Promise<TransactionResponse>;
  unlockedBalanceOf(account: AddressType): Promise<number>;
  lockedBalanceOf(account: AddressType): Promise<number>;
}
