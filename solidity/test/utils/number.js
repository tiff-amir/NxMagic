const mathjs = require('mathjs');

const removeDecimals = (value) => {
  const increase = value.match(/e\+[0-9]+$/);
  if (!increase) return value.replace(/\.[0-9]+/, '');
  let times = Number(increase[0].replace('e+', ''));
  let [int, decimals] = value.split('.');
  for (let i = 0; i < times; i += 1) {
    int = `${int}${decimals[i] || '0'}`;
  }
  return int;
};

const fromWei = (wei, decimals = 18) => {
  const oneWei = mathjs.bignumber(`1${(new Array(decimals)).fill(0).join('')}`);
  const ether = mathjs.divide(mathjs.bignumber(typeof wei === 'string' ? wei : wei.toString()), oneWei);
  return Number(ether.toString());
};

const toWei = (amount, decimals = 18) => {
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

module.exports = { toWei, fromWei };
