import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { BytesLike } from '@ethersproject/bytes';
import { AccessListish, Transaction } from '@ethersproject/transactions';

export type AddressType = string;
export type Ether = number;

export interface Log {
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;

  removed: boolean;

  address: string;
  data: string;

  topics: Array<string>;

  transactionHash: string;
  logIndex: number;
}

export interface TransactionReceipt {
  to: string;
  from: string;
  contractAddress: string,
  transactionIndex: number,
  root?: string,
  gasUsed: BigNumber,
  logsBloom: string,
  blockHash: string,
  transactionHash: string,
  logs: Array<Log>,
  blockNumber: number,
  confirmations: number,
  cumulativeGasUsed: BigNumber,
  effectiveGasPrice: BigNumber,
  byzantium: boolean,
  type: number;
  status?: number
};

export type TransactionRequest = {
  to?: string,
  from?: string,
  nonce?: BigNumberish,

  gasLimit?: BigNumberish,
  gasPrice?: BigNumberish,

  data?: BytesLike,
  value?: BigNumberish,
  chainId?: number

  type?: number;
  accessList?: AccessListish;

  maxPriorityFeePerGas?: BigNumberish;
  maxFeePerGas?: BigNumberish;

  customData?: Record<string, any>;
};

export interface TransactionResponse extends Transaction {
  hash: string;

  // Only if a transaction has been mined
  blockNumber?: number,
  blockHash?: string,
  timestamp?: number,

  confirmations: number,

  // Not optional (as it is in Transaction)
  from: string;

  // The raw transaction
  raw?: string,

  // This function waits until the transaction has been mined
  wait: (confirmations?: number) => Promise<TransactionReceipt>
}
