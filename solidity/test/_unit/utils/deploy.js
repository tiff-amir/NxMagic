const appConfig = require('../../../../appConfig.json');
const { toWei } = require('../../utils/number');

const Token = artifacts.require(`./${appConfig.token.name}.sol`);

// eslint-disable-next-line no-undef
const w3 = web3;

const getEnv = () => {
  const env = {
    prevMain: '', token: null, w3,
  };
  const getter = (name) => env[name];

  getter.deploy = async (main = 'unknown', force = false) => {
    if (main === env.prevMain && !force) return Promise.resolve(false);
    env.prevMain = main;
    env.token = await Token.new(
      toWei(appConfig.token.totalSupply, appConfig.token.decimals),
      appConfig.token.decimals,
      toWei(appConfig.token.tokenomics.liquidity, appConfig.token.decimals),
      toWei(appConfig.token.tokenomics.team, appConfig.token.decimals),
      toWei(appConfig.token.tokenomics.marketing, appConfig.token.decimals),
    );
    await env.token.setDecreaseFee(toWei(appConfig.token.decreaseFee, appConfig.token.decimals));
    await env.token.setMaxLockedAmount(
      toWei(appConfig.token.maxLockedAmount, appConfig.token.decimals),
    );
    await env.token.withdrawTokens(
      2, toWei(appConfig.token.tokenomics.team, appConfig.token.decimals),
    );
    return true;
  };
  return getter;
};

module.exports = getEnv;
