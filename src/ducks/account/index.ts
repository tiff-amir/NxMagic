import { createActions, handleActions } from 'redux-actions';
import { StoreActionType } from 'src/types/general';
import { WalletConnector } from 'src/types/account';

export const CONNECT = 'account@CONNECT';
export const RECONNECT = 'account@RECONNECT';
export const UPDATE = 'account@UPDATE';
export const DISCONNECT = 'account@DISCONNECT';
export const SET = 'account@SET';
export const CONNECT_ERROR = 'account@CONNECT_ERROR';

export const {
  accountConnect,
  accountReconnect,
  accountUpdate,
  accountDisconnect,
  accountSet,
  accountConnectError,
} = createActions(
  CONNECT,
  RECONNECT,
  UPDATE,
  DISCONNECT,
  SET,
  CONNECT_ERROR,
);

export type StateType = {
  wallet: {
    type?: WalletConnector
    address: string
    addresses: string[]
    isConnecting: boolean
    error: string
    balance: number
    fullBalance: number
  }
};

export const whiteList = [
  [
    'wallet.address',
    (state: StateType) => ['wallet.isConnecting', Boolean(state.wallet.address)],
  ],
];

export const defaultState: StateType = {
  wallet: {
    type: undefined,
    address: '',
    addresses: [],
    isConnecting: false,
    error: '',
    balance: 0,
    fullBalance: 0,
  },
};

export default handleActions({
  [CONNECT]: (state: StateType, { payload }: StoreActionType<WalletConnector>): StateType => ({
    ...state,
    wallet: {
      type: payload,
      address: '',
      addresses: [],
      isConnecting: true,
      error: '',
      balance: 0,
      fullBalance: 0,
    },
  }),
  [RECONNECT]: (state: StateType): StateType => ({
    ...state,
    wallet: {
      ...state.wallet,
      isConnecting: true,
      error: '',
    },
  }),
  [SET]: (
    state: StateType,
    { payload }: {
      payload: { balance: number, fullBalance: number, address: string; addresses: string[] }
    },
  ): StateType => ({
    ...state,
    wallet: {
      ...state.wallet,
      address: payload.address,
      addresses: payload.addresses,
      isConnecting: false,
      balance: payload.balance,
      fullBalance: payload.fullBalance,
    },
  }),
  [DISCONNECT]: (
    state: StateType,
  ): StateType => ({
    ...state,
    wallet: {
      type: undefined,
      address: '',
      addresses: [],
      isConnecting: false,
      error: '',
      balance: 0,
      fullBalance: 0,
    },
  }),
  [CONNECT_ERROR]: (state: StateType, { payload }: { payload: string }): StateType => ({
    ...state,
    wallet: {
      ...state.wallet,
      address: '',
      isConnecting: false,
      error: payload,
    },
  }),
}, defaultState);
