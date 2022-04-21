import { all, call, put, select, takeLatest, race } from 'redux-saga/effects';
import { connect } from '@api/metaMask';

import { NOT_FOUND_ERROR } from '@constants/errors';
import * as actions from '@ducks/account';
import {
  getAccountAddress,
  getAccountBalance,
  getAccountFullBalance,
} from '@ducks/account/selectors';
import { same } from '@utils/address';
import { getContract } from '@contracts/index';
import INxMagic from '@contracts/NxMagic/INxMagic';
import appConfig from 'appConfig.json';
import { StoreActionType } from 'src/types/general';
import { WalletConnector } from 'src/types/account';
import { timeout } from '@utils/actions';
import { log } from '@utils/logger';
import { getProcessedError } from '@utils/error';

const CONNECT_TIMEOUT = 5000;

export function* metaMaskConnectAccount() {
  try {
    const [[addresses, umill]] = yield race([
      all([call(connect), call(getContract, appConfig.token.name)]),
      call(timeout, CONNECT_TIMEOUT),
    ]);
    if (!addresses.length) throw new Error(NOT_FOUND_ERROR);
    const address = addresses[0];
    const [balance, fullBalance] = yield all([
      call((umill as INxMagic).unlockedBalanceOf, address),
      call((umill as INxMagic).balanceOf, address),
    ]);
    yield put(actions.accountSet({ address, addresses, balance, fullBalance }));
  } catch (e) {
    yield put(actions.accountConnectError(getProcessedError(e.message)));
  }
}

export function* walletConnectConnectAccount() {
  try {
    throw new Error(NOT_FOUND_ERROR);
  } catch (e) {
    yield put(actions.accountConnectError(getProcessedError(e.message)));
  }
}

export function* connectAccount({ payload }: StoreActionType<WalletConnector>) {
  if (payload === WalletConnector.MetaMask) {
    yield metaMaskConnectAccount();
  } else if (payload === WalletConnector.WalletConnect) {
    yield walletConnectConnectAccount();
  }
}

export function* reconnectAccount() {
  const address = yield select(getAccountAddress);
  try {
    const [[addresses, umill]] = yield race([
      all([call(connect), call(getContract, appConfig.token.name)]),
      call(timeout, CONNECT_TIMEOUT),
    ]);
    if (!addresses.length || !addresses.some((check) => same(check, address))) {
      throw new Error(NOT_FOUND_ERROR);
    }
    const [balance, fullBalance] = yield all([
      call((umill as INxMagic).unlockedBalanceOf, address),
      call((umill as INxMagic).balanceOf, address),
    ]);
    yield put(actions.accountSet({ address, addresses, balance, fullBalance }));
  } catch (e) {
    yield put(actions.accountConnectError(getProcessedError(e.message)));
  }
}

export function* updateBalance() {
  const address = yield select(getAccountAddress);
  const balance = yield select(getAccountBalance);
  const fullBalance = yield select(getAccountFullBalance);
  try {
    const [[updatedAddresses, umill]] = yield race([
      all([call(connect), call(getContract, appConfig.token.name)]),
      call(timeout, CONNECT_TIMEOUT),
    ]);
    const updatedAddress = updatedAddresses[0];
    const [updatedBalance, updatedFullBalance] = yield all([
      call((umill as INxMagic).unlockedBalanceOf, updatedAddress),
      call((umill as INxMagic).balanceOf, updatedAddress),
    ]);
    if (balance !== updatedBalance || fullBalance !== updatedFullBalance
      || address !== updatedAddress) {
      yield put(actions.accountSet({
        address: updatedAddress,
        addresses: updatedAddresses,
        balance: updatedBalance,
        fullBalance: updatedFullBalance,
      }));
    }
  } catch (e) {
    log(getProcessedError(e.message));
  }
}

export function* watchAccount() {
  yield takeLatest(actions.CONNECT, connectAccount);
  yield takeLatest(actions.RECONNECT, reconnectAccount);
  yield takeLatest(actions.UPDATE, updateBalance);
}
