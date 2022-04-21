import { TransactionResponse, AddressType, Ether } from 'src/types/contract';
import IBaseContract from '@contracts/BaseContract/IBaseContract';

export default interface ICommonCoin extends IBaseContract {
  name(): Promise<string>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;
  balanceOf(account: AddressType): Promise<number>;
  allowance(owner: AddressType, spender: AddressType): Promise<number>;
  approve(spender: AddressType, amount: Ether): Promise<TransactionResponse>;
}
