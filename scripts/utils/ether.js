const ethers = require('ethers');
const path = require('path');
const axios = require('axios');
const _ = require('lodash');

const { readFile, writeFile, checkFolder, mkdir, folderFiles } = require('./fs');
const { ROOT_PATH, ABI_LINK_MAIN, ABI_LINK_TEST } = require('../../constants/path');

const ABI_CACHE_MAIN = path.join(ROOT_PATH, '_temp/abi-cache-main');
const ABI_CACHE_TEST = path.join(ROOT_PATH, '_temp/abi-cache-test');
const BSC_API_KEY_PATH = path.join(ROOT_PATH, '.bsc-api-key');
const PRIVATE_KEY_PATH = path.join(ROOT_PATH, 'private-key.json');
const ABI_PATH = path.join(ROOT_PATH, 'solidity/abis');
const VERIFICATION_FOLDER = path.join(ROOT_PATH, '_temp/verification-prepared');

const providerMain = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/', {
  name: 'binance', chainId: 56,
});
const providerTest = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545', {
  name: 'binance', chainId: 97,
});

let provider = providerTest;

const delay = async (milliseconds = 0) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});

const checkTest = () => provider === providerTest;

const getPrivateKey = async () => {
  const privateKey = await readFile(PRIVATE_KEY_PATH, true);
  return checkTest() ? _.get(privateKey, 'test') : _.get(privateKey, 'main');
};

const getBscApiKey = async () => {
  const privateKey = await readFile(BSC_API_KEY_PATH);
  return privateKey.trim().replace('\n', '');
};

const getWallet = (() => {
  const info = {
    test: { wallet: null, promise: null },
    main: { wallet: null, promise: null },
  };
  return async () => {
    const data = checkTest() ? info.test : info.main;
    const innerProvider = provider;
    if (data.wallet) return data.wallet;
    if (data.promise) return data.promise;
    data.promise = new Promise((resolve, reject) => {
      getPrivateKey().then((privateKey) => {
        data.wallet = new ethers.Wallet(privateKey, innerProvider);
        resolve(data.wallet);
      }).catch(reject);
    });
    return data.promise;
  };
})();

const getRootName = (() => {
  let name = '';
  return async () => {
    if (name) return name;
    const files = await folderFiles(VERIFICATION_FOLDER);
    if (files && files.length === 1) {
      name = files[0].replace('.sol', '');
      return name;
    }
    throw new Error('cannot find verified name');
  };
})();

const getRootMetadata = (() => {
  let cache = '';
  return async () => {
    if (cache) return cache;
    const name = await getRootName();
    cache = readFile(path.join(ABI_PATH, `${name}.json`), true);
    return cache;
  };
})();

const getJsonByLink = async (link) => {
  const { data } = await axios.get(link);
  return typeof data === 'object' ? data : JSON.parse(data.toString());
};

const writeCacheMetadata = (() => {
  const info = {
    main: null,
    test: null,
  };
  return async (data, address, isMain) => {
    const key = isMain ? 'main' : 'test';
    const folderPath = isMain ? ABI_CACHE_MAIN : ABI_CACHE_TEST;
    try {
      if (_.isNull(info[key])) {
        info[key] = await checkFolder(folderPath);
        if (!info[key]) await mkdir(folderPath);
      }
      const filePath = path.join(folderPath, address.toLowerCase());
      await writeFile(filePath, JSON.stringify(data));
    } catch (e) {
      console.log('error on write cache');
    }
  };
})();

const readCacheMetadata = (() => {
  const cache = {
    main: {},
    test: {},
  };
  return async (address, isMain) => {
    const rootKey = isMain ? 'main' : 'test';
    const key = address.toLowerCase();
    const folderPath = isMain ? ABI_CACHE_MAIN : ABI_CACHE_TEST;
    if (cache[rootKey][key]) return cache[rootKey][key];
    try {
      const filePath = path.join(folderPath, key);
      cache[key] = await readFile(filePath, true);
      return cache[key];
    } catch (e) {
      return '';
    }
  };
})();

const getAddressMetadata = (() => {
  const cache = {
    main: {},
    test: {},
  };
  let prevTimestamp = 0;
  return async (address, isMain) => {
    const rootKey = isMain ? 'main' : 'test';
    const wait = Math.max(0, 3000 - (Date.now() - prevTimestamp));
    const link = isMain ? ABI_LINK_MAIN : ABI_LINK_TEST;
    if (wait > 0) await delay(wait);
    prevTimestamp = Date.now();
    const key = address.toLowerCase();
    if (cache[rootKey][key]) return cache[rootKey][key];
    let abi = await readCacheMetadata(address, isMain);
    if (!abi) abi = await getJsonByLink(link.replace('{{address}}', address));
    cache[rootKey][key] = { abi };
    if (abi) writeCacheMetadata(abi, address, isMain);
    return cache[rootKey][key];
  };
})();

const getMetadata = (address, isMain) => (address
  ? getAddressMetadata(address, isMain) : getRootMetadata());

const getContract = (() => {
  let cache = {
    main: {},
    test: {},
  };
  return async (address, isRoot) => {
    const rootKey = checkTest() ? 'test' : 'main';
    const key = address.toLowerCase();
    const providerLocal = provider;
    if (cache[rootKey][key]) return cache[rootKey][key];
    const [{ abi }, wallet] = await Promise.all([getMetadata(isRoot ? '' : address, !checkTest()), getWallet()]);
    const contract = new ethers.Contract(address, abi, providerLocal);
    cache[rootKey][key] = contract.connect(wallet);
    return cache[rootKey][key];
  };
})();

const getOptions = (() => {
  let gasPrice = 0;
  return async (params = {}) => {
    const { gasLimit, value } = params;
    if (!gasPrice) gasPrice = await provider.getGasPrice();
    const price = ethers.utils.formatUnits(gasPrice, 'gwei');
    return {
      ...(value ? { value } : {}),
      ...(gasLimit ? { gasLimit } : {}),
      gasPrice: ethers.utils.parseUnits(price, 'gwei'),
    };
  };
})();

const getBalance = (address) => provider.getBalance(address);

module.exports = {
  checkTest,
  getBalance,
  getWallet,
  getContract,
  getPrivateKey,
  getMetadata,
  getOptions,
  getBscApiKey,
  getProvider: () => provider,
  setProviderType: (type) => {
    if (type === 'main') {
      provider = providerMain;
      return true;
    }
    if (type === 'test') {
      provider = providerTest;
      return true;
    }
    return false;
  },
};
