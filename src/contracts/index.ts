import { ethers } from 'ethers';
import { Store } from 'redux';
import type { ContractInterface } from '@ethersproject/contracts/src.ts';
import type { ExternalProvider, Web3Provider } from '@ethersproject/providers/src.ts/web3-provider';

import appConfig from 'appConfig.json';
import { CONTRACT_NOT_FOUND_ERROR, NETWORK_ERROR, NOT_FOUND_ERROR, TYPE_ERROR } from '@constants/errors';
import NxMagic, { INxMagic } from '@contracts/NxMagic';
import { CoinInfoType, ContractType } from 'src/types/general';
import { AddressType } from 'src/types/contract';
import BaseContract from '@contracts/BaseContract';
import { getCoinInfo as getCoinInfoState } from '@ducks/coin/selectors';
import { ICommonCoin } from '@contracts/CommonCoin';

let store: Store = null;

const CONSTRUCTORS = {
  NxMagic,
};

export const getWeb3Provider = ((): () => Web3Provider => {
  let provide: Web3Provider | undefined;
  return (): Web3Provider => {
    if (provide) return provide;
    const { ethereum } = (window as unknown as { ethereum: ExternalProvider });
    return new ethers.providers.Web3Provider(ethereum);
  };
})();

const getContractMetadataInfo = (
  contractMetadata: { [key: string]: any },
): { abi: ContractInterface, address: string } => {
  const { abi } = contractMetadata;
  const { address } = appConfig.token;
  return { abi, address };
};

const fetchContractAbi = async (name: string): Promise<{ [key: string]: any }> => {
  let resp;
  try {
    resp = await fetch(`${appConfig.webApp.rootAbiPath}/${name}.json`);
  } catch (e) {
    throw new Error(NETWORK_ERROR);
  }
  try {
    return resp.json();
  } catch (e) {
    throw new Error(TYPE_ERROR);
  }
};

export const setStore = (value: Store) => {
  store = value;
};

export const getContract = (() => {
  const cache: { [key: string]: any } = {};
  return async <T>(name: string): Promise<T> => {
    if (cache[name]) return cache[name];
    if (!store) throw new Error(NOT_FOUND_ERROR);
    const contractMetadata = await fetchContractAbi(name);
    const { abi, address } = getContractMetadataInfo(contractMetadata);
    if (!abi || !address) throw new Error(CONTRACT_NOT_FOUND_ERROR);
    const provider = getWeb3Provider();
    const code = await provider.getCode(address);
    if (code === '0x' || code === '0X') throw new Error(CONTRACT_NOT_FOUND_ERROR);
    const ethersContract = new ethers.Contract(
      address, abi, provider.getSigner(),
    ) as unknown as { [key: string]: (...args: any[]) => Promise<any> };
    const Constr = CONSTRUCTORS[name];
    cache[name] = new Constr(ethersContract, store);
    return cache[name];
  };
})();

export const getCoin = (() => {
  const rootCoinName = 'NxMagic';
  const cache: { [key: string]: ICommonCoin } = {};
  return async (address: AddressType): Promise<ICommonCoin> => {
    const processedAddress = address.toLowerCase();
    if (cache[processedAddress]) return cache[processedAddress];
    if (!store) throw new Error(NOT_FOUND_ERROR);
    const contractMetadata = await fetchContractAbi(rootCoinName);
    const { abi } = getContractMetadataInfo(contractMetadata);
    if (!abi) throw new Error(NOT_FOUND_ERROR);
    const provider = getWeb3Provider();
    const ethersContract = new ethers.Contract(
      processedAddress, abi, provider.getSigner(),
    ) as unknown as ContractType;
    const Constr = CONSTRUCTORS[rootCoinName];
    cache[processedAddress] = new Constr(ethersContract, store);
    return cache[processedAddress];
  };
})();

export const getCoinInfo = (() => {
  const template = 'NxMagic';
  const cache: { [key: string]: CoinInfoType } = {};
  return async (
    address: AddressType,
  ): Promise<CoinInfoType> => {
    const processedAddress = address.toLowerCase();
    if (!store) return { name: '', symbol: '', decimals: 18, address };
    const storeInfo = getCoinInfoState(store.getState(), processedAddress);
    if (storeInfo) return storeInfo;
    if (cache[processedAddress]) return cache[processedAddress];
    const contractMetadata = await fetchContractAbi(template);
    const info = getContractMetadataInfo(contractMetadata);
    if (!info.abi) return { name: '', symbol: '', decimals: 18, address };
    const provider = getWeb3Provider();
    const ethersContract = new ethers.Contract(
      processedAddress, info.abi, provider.getSigner(),
    ) as unknown as ContractType;
    const Constr = CONSTRUCTORS[template];
    const contract = new Constr(ethersContract, store) as INxMagic;
    const [resolvedAddress, name, symbol, decimals] = await Promise.all(
      [contract.resolvedAddress(), contract.name(), contract.symbol(), contract.decimals()],
    );
    if (!resolvedAddress) return { name: '', symbol: '', decimals: 18, address };
    cache[processedAddress] = {
      name: name as string,
      symbol: symbol as string,
      decimals: decimals as number,
      address: resolvedAddress as string,
    };
    return cache[processedAddress];
  };
})();

BaseContract.fetchCoinInfo = getCoinInfo;
