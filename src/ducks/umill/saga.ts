import { takeLatest, call, put, select } from 'redux-saga/effects';

import * as actions from '@ducks/umill';
import * as accountActions from '@ducks/account';
import { StoreActionType } from 'src/types/general';
import { getContract } from '@contracts/index';
import appConfig from 'appConfig.json';
import {
  getAccountAddress,
  getAccountAddresses,
  getAccountBalance,
  getAccountFullBalance,
} from '@ducks/account/selectors';
import { INxMagic } from '@contracts/NxMagic';
import { AddressType } from 'src/types/contract';

export function* increase({ payload }: StoreActionType<number>) {
  const balance = yield select(getAccountBalance);
  const address = yield select(getAccountAddress);
  const addresses = yield select(getAccountAddresses);
  try {
    const contract = yield call(getContract, appConfig.token.name);
    yield call((contract as INxMagic).increase, Math.floor(payload) || 1);
    yield put(actions.umillIncreaseFinished());
    yield put(accountActions.accountSet({
      address, addresses, balance, fullBalance: balance + balance * payload,
    }));
  } catch (e) {
    yield put(actions.umillIncreaseError(e.message));
  }
}

export function* decrease({ payload }: StoreActionType<AddressType>) {
  const balance = yield select(getAccountBalance);
  const fullBalance = yield select(getAccountFullBalance);
  const address = yield select(getAccountAddress);
  const addresses = yield select(getAccountAddresses);
  try {
    const contract = yield call(getContract, appConfig.token.name);
    if (payload === address) {
      yield call((contract as INxMagic).decrease);
      yield put(accountActions.accountSet({ address, addresses, balance, fullBalance: balance }));
    } else {
      yield call(
        (contract as INxMagic).decrease,
        payload,
        { value: appConfig.token.decreaseFee },
      );
      yield put(accountActions.accountSet({ address, addresses, balance, fullBalance }));
    }
    yield put(actions.umillDecreaseFinished());
  } catch (e) {
    yield put(actions.umillDecreaseError(e.message));
  }
}

export function* watchUmill() {
  yield takeLatest(actions.INCREASE, increase);
  yield takeLatest(actions.DECREASE, decrease);
}
