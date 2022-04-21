import { combineReducers } from 'redux';
import { all, AllEffect, ForkEffect } from 'redux-saga/effects';

import * as account from './account';
import { watchAccount } from './account/saga';

import * as coin from './coin';
import { watchCoin } from './coin/saga';

import * as config from './config';
import { watchFee } from './config/saga';

import * as umill from './umill';
import { watchUmill } from './umill/saga';

export const reducers = {
  account,
  config,
  coin,
  umill,
};

export const whitelist = Object.keys(reducers)
  .filter((name) => reducers[name]?.whiteList?.length)
  .map((name) => ({
    name,
    list: reducers[name].whiteList.map((item) => {
      return typeof item === 'string' ? [item] : item;
    }),
  }));

export function* rootSaga(): Generator<AllEffect<Generator<ForkEffect<never>, void, unknown>>> {
  yield all([
    watchAccount(),
    watchCoin(),
    watchFee(),
    watchUmill(),
  ]);
}

export default combineReducers(Object.keys(reducers).reduce((acc, name) => {
  acc[name] = reducers[name].default;
  return acc;
}, {}));
