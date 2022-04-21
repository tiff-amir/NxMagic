/* eslint-disable no-param-reassign */
import { createStore, compose, applyMiddleware, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import get from 'lodash.get';
import set from 'lodash.set';

import { setStore } from '@contracts/index';
import rootReducer, { rootSaga, reducers, whitelist } from '../ducks';
import PersistStorage from './PersistStorage';

type Data = {
  store: Store
};
const data: Data = { store: null };
const composeEnhancers = typeof window !== 'undefined'
  ? (window as unknown as any)?.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  : compose;

const PERSIST_NAME = 'persist:UMill';
const storage = new PersistStorage(Object.keys(reducers).map((name) => reducers[name]));
const persistData = storage.getItem(PERSIST_NAME);

whitelist.forEach(({ name, list }) => {
  const reducer = reducers[name];
  const info = get(persistData, name);
  if (!info || !reducer) return;
  const { defaultState } = reducer;
  list.forEach(([path, ...postProcessors]) => {
    const val = info[path];
    if (val !== undefined && get(defaultState, path) !== undefined) {
      set(defaultState, path, val);
      postProcessors.forEach((postProcessor) => {
        const [innerPath, innerVal] = postProcessor(defaultState);
        if (innerVal !== undefined) set(defaultState, innerPath, innerVal);
      });
    }
  });
});

const configureStore = (): Data => {
  const sagaMiddleware = createSagaMiddleware();
  data.store = createStore(
    rootReducer,
    {},
    composeEnhancers(applyMiddleware(
      sagaMiddleware,
    )),
  );
  sagaMiddleware.run(rootSaga);
  setStore(data.store);
  return data;
};

export const getStore = (): Store => (data.store ? data.store : configureStore().store);
export const getData = (): Data => (data.store ? data : configureStore());

const persist = () => {
  const state = getStore().getState();
  const info = whitelist.reduce((acc, { name, list }) => {
    acc[name] = list.reduce((accInner, [path]) => {
      accInner[path] = get(state, `${name}.${path}`);
      return accInner;
    }, {});
    return acc;
  }, {});
  storage.setItem(PERSIST_NAME, info);
};

if (typeof window !== 'undefined') {
  (window as unknown as { getStore: () => Store }).getStore = getStore;
  window.addEventListener('beforeunload', persist);
}
