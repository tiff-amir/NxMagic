import StateType from '@ducks/StateType';
import { WalletConnector } from 'src/types/account';

export const getAccountAddress = (state: StateType): string => state.account.wallet.address;

export const getAccountAddresses = (state: StateType): string[] => state.account.wallet.addresses;

export const getAccountBalance = (state: StateType): number => state.account.wallet.balance;

export const getAccountFullBalance = (
  state: StateType,
): number => state.account.wallet.fullBalance;

export const checkConnecting = (state: StateType): boolean => state.account.wallet.isConnecting;

export const getConnectError = (state: StateType): string => state.account.wallet.error;

export const getConnector = (state: StateType): WalletConnector => state.account.wallet.type;
