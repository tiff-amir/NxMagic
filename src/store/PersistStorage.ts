/* eslint-disable class-methods-use-this */
import noop from 'lodash.noop';

const { localStorage, sessionStorage } = typeof window !== 'undefined' ? window : {
  localStorage: { getItem: noop, setItem: noop, removeItem: noop },
  sessionStorage: { getItem: noop, setItem: noop, removeItem: noop },
};

const getStorageParsedData = (data) => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

class PersistStorage {
  private reducers: Array<{ persistStorageType?: 'session' | 'local' }>;

  constructor(reducers: Array<{ persistStorageType?: 'session' | 'local' }>) {
    this.reducers = reducers;
  }

  getItem(key: string) {
    const localData = getStorageParsedData(localStorage.getItem(key));
    const sessionData = getStorageParsedData(sessionStorage.getItem(key));
    return !localData && !sessionData ? null : {
      ...(localData || {}),
      ...(sessionData || {}),
    };
  }

  setItem(key: string, item: any) {
    const { localData, sessionData } = Object.keys(item).reduce((acc, reducer) => {
      (({
        session: acc.sessionData,
        local: acc.localData,
      }[this.reducers[reducer]?.persistStorageType]) || acc.localData)[reducer] = item[reducer];
      return acc;
    }, { localData: {}, sessionData: {} });
    localStorage.setItem(key, JSON.stringify(localData));
    sessionStorage.setItem(key, JSON.stringify(sessionData));
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}

export default PersistStorage;
