import { takeEvery, call, put, select } from 'redux-saga/effects';

import * as actions from '@ducks/coin';
import * as selectors from '@ducks/coin/selectors';
import { StoreActionType } from 'src/types/general';
import { AddressType } from 'src/types/contract';
import { getCoinInfo } from '@contracts/index';

export function* add({ payload }: StoreActionType<AddressType>) {
  let coinInfo = yield select(selectors.getCoinInfo, payload);
  const isFetching = yield select(selectors.checkFetching, payload);
  if (coinInfo || isFetching) return;
  yield put(actions.coinFetchStart(payload));
  try {
    coinInfo = yield call(getCoinInfo, payload);
    yield put(actions.coinAdd(coinInfo));
    yield put(actions.coinFetchFinished(payload));
  } catch (e) {
    yield put(actions.coinFetchFinished(payload));
  }
}

export function* watchCoin() {
  yield takeEvery(actions.FETCH, add);
}
