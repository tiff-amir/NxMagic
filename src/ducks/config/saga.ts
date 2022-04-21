import { put, takeEvery } from 'redux-saga/effects';

import * as actions from '@ducks/config';

export function* updateFee() {
  try {
    yield put(actions.configUpdateFeeSuccess(0));
  } catch (e) {
    yield put(actions.configUpdateFeeError(e.message));
  }
}

export function* watchFee() {
  yield takeEvery(actions.UPDATE_FEE, updateFee);
}
