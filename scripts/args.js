const appConfig = require('../appConfig.json');
const { toWei } = require('../solidity/test/utils/number');

const args = [
  toWei(appConfig.token.decreaseFee, appConfig.token.decimals),
  toWei(appConfig.token.maxLockedAmount, appConfig.token.decimals),
];

const str = args.map((val) => `'${val}'`).join(', ');

console.log(`[${str}]`);
