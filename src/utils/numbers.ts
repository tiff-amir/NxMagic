import * as mathjs from 'mathjs';

import { Ether } from 'src/types/contract';
import { BigNumber } from 'ethers';

export const getKeyArray = (key: string): Uint8Array => {
  const length = Math.floor(key.length / 2);
  return (new Uint8Array(length)).fill(0).map((_, i) => {
    return parseInt(key.substr(i * 2, 2), 16);
  });
};

export const normalizeKey = (key: string): string => {
  return key.replace(/^0x/, '').toLowerCase();
};

const removeDecimals = (value: string): string => {
  const increase = value.match(/e\+[0-9]+$/);
  if (!increase) return value.replace(/\.[0-9]+/, '');
  let times = Number(increase[0].replace('e+', ''));
  let [int, decimals] = value.split('.');
  for (let i = 0; i < times; i += 1) {
    int = `${int}${decimals[i] || '0'}`;
  }
  return int;
};

export const toWei = (amount: Ether, decimals = 18): string => {
  const oneWei = mathjs.bignumber(`1${(new Array(decimals)).fill(0).join('')}`);
  let value = mathjs.multiply(mathjs.bignumber(amount), oneWei);
  let increaseValue = 1;
  let increase = '';
  let str = value.toString();
  if (/e\+[0-9]+$/.test(str)) {
    increaseValue = Number(str.replace(/^[^+]+\+/, ''));
    increase = `1${(new Array(increaseValue)).fill('0').join('')}`;
    value = mathjs.divide(value, mathjs.bignumber(increase));
  }
  if (!increase) return /e-[0-9]+$/.test(str) ? '0' : removeDecimals(str);
  const [int, dec] = value.toString().split('.');
  let val = int;
  for (let i = 0; i < increaseValue; i += 1) val = `${val}${(dec ? dec[i] : '0') || '0'}`;
  return val;
};

export const fromWei = (wei: BigNumber | string, decimals = 18): Ether => {
  const oneWei = mathjs.bignumber(`1${(new Array(decimals)).fill(0).join('')}`);
  const ether = mathjs.divide(mathjs.bignumber(typeof wei === 'string' ? wei : wei.toString()), oneWei);
  return Number(ether.toString());
};
