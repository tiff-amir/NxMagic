const _ = require('lodash');

const { getContract, checkTest, getOptions, getWallet } = require('./ether');
const { fromWei, toWei } = require('../../solidity/test/utils/number');
const {
  PANCAKE_FACTORY_ADDRESS_MAIN,
  PANCAKE_FACTORY_ADDRESS_TEST,
  PANCAKE_ROUTER_ADDRESS_MAIN,
  PANCAKE_ROUTER_ADDRESS_TEST,
  WBNB_ADDRESS_MAIN,
  WBNB_ADDRESS_TEST,
  EMPTY_ADDRESS,
} = require('../../constants/address');

const getPair = async (tokenAddress) => {
  const isTest = checkTest();
  const factoryAddress = isTest ? PANCAKE_FACTORY_ADDRESS_TEST : PANCAKE_FACTORY_ADDRESS_MAIN;
  const wbnbAddress = isTest ? WBNB_ADDRESS_TEST : WBNB_ADDRESS_MAIN;
  const contract = await getContract(factoryAddress);
  try {
    return await contract.getPair(tokenAddress, wbnbAddress);
  } catch (e) {
    const { reason } = e;
    if (reason === 'bad address checksum') return EMPTY_ADDRESS;
    throw e;
  }
};

const createPair = async (tokenAddress) => {
  const isTest = checkTest();
  const wbnbAddress = isTest ? WBNB_ADDRESS_TEST : WBNB_ADDRESS_MAIN;
  const factoryAddress = isTest ? PANCAKE_FACTORY_ADDRESS_TEST : PANCAKE_FACTORY_ADDRESS_MAIN;
  const [contract, options] = await Promise.all([
    getContract(factoryAddress),
    getOptions(),
  ]);
  const existsPair = await getPair();
  if (existsPair !== EMPTY_ADDRESS) return existsPair;
  const tx = await contract.createPair(tokenAddress, wbnbAddress, options);
  const resp = await tx.wait();
  return _.get(resp, 'events.0.args.pair');
};

const approve = async (tokenAddress, params = {}) => {
  const isTest = checkTest();
  const {
    gasLimit,
    approveAmount = '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  } = params;
  const [wallet, contract, options] = await Promise.all([
    getWallet(),
    getContract(tokenAddress, true),
    getOptions(gasLimit ? { gasLimit } : undefined),
  ]);
  const routerAddress = isTest ? PANCAKE_ROUTER_ADDRESS_TEST : PANCAKE_ROUTER_ADDRESS_MAIN;
  const approvedAmount = await contract.allowance(wallet.address, routerAddress);
  if (Number(approvedAmount.toString()) > 0) return Promise.resolve();
  const tx = await contract.approve(routerAddress, approveAmount, options);
  return tx.wait();
};

const addLiquidity = async ({ pair, tokenAddress, amountToken, amountETH, gasLimit }) => {
  const isTest = checkTest();
  const routerAddress = isTest ? PANCAKE_ROUTER_ADDRESS_TEST : PANCAKE_ROUTER_ADDRESS_MAIN;
  const [wallet, contract, pairContract, options] = await Promise.all([
    getWallet(),
    getContract(routerAddress),
    pair ? getContract(pair) : Promise.resolve(),
    getOptions({ value: amountETH, gasLimit: gasLimit || 100000 }),
  ]);
  if (pairContract) {
    const currentLiquidity = await pairContract.balanceOf(wallet.address);
    if (Number(currentLiquidity.toString()) > 0) return Promise.resolve();
  }
  const deadline = Math.round(((new Date()).getTime() + 1000 * 60) / 1000);
  const tx = await contract.addLiquidityETH(
    tokenAddress, amountToken, amountToken, amountETH, wallet.address, deadline, options,
  );
  return tx.wait();
};

const sell = async ({ tokenAddress, amountToken, gasLimit, slippage = 0.005 }) => {
  const isTest = checkTest();
  const wbnbAddress = isTest ? WBNB_ADDRESS_TEST : WBNB_ADDRESS_MAIN;
  const routerAddress = isTest ? PANCAKE_ROUTER_ADDRESS_TEST : PANCAKE_ROUTER_ADDRESS_MAIN;
  const path = [tokenAddress, wbnbAddress];
  const [wallet, routerContract, options] = await Promise.all([
    getWallet(),
    getContract(routerAddress),
    getOptions({ gasLimit: gasLimit || 100000 }),
  ]);
  const outs = await routerContract.getAmountsOut(amountToken, path);
  const out = fromWei(outs[1].toString(), 18) * (1 - slippage);
  const deadline = Math.round(((new Date()).getTime() + 1000 * 60) / 1000);
  const tx = await routerContract.swapExactTokensForETH(
    amountToken, toWei(out, 18), path, wallet.address, deadline, options,
  );
  return tx.wait();
};

module.exports = {
  sell,
  getPair,
  approve,
  createPair,
  addLiquidity,
};
