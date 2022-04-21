const appConfig = require('../../appConfig.json');
const { toWei } = require('../test/utils/number');

const Token = artifacts.require(appConfig.token.name);

const deployCommonBsc = async (deployer) => {
  await deployer.deploy(
    Token,
    toWei(appConfig.token.totalSupply, appConfig.token.decimals),
    appConfig.token.decimals,
    toWei(appConfig.token.tokenomics.liquidity, appConfig.token.decimals),
    toWei(appConfig.token.tokenomics.team, appConfig.token.decimals),
    toWei(appConfig.token.tokenomics.marketing, appConfig.token.decimals),
  );
  const token = await Token.deployed();
  await token.setDecreaseFee(toWei(appConfig.token.decreaseFee, appConfig.token.decimals));
  await token.setMaxLockedAmount(toWei(appConfig.token.maxLockedAmount, appConfig.token.decimals));
  return token;
};

const deployMainBsc = async (deployer) => deployCommonBsc(deployer);

const deployDevBsc = async (deployer) => {
  const token = await deployCommonBsc(deployer);
  await token.withdrawTokens(2, toWei(10000, appConfig.token.decimals));
};

module.exports = async (deployer) => {
  const isDev = ['development', 'dev', 'local', 'soliditycoverage', 'test'].includes(deployer.network);
  const isBsc = deployer.network.includes('bsc') || isDev;
  if (isDev && isBsc) return deployDevBsc(deployer);
  if (!isDev && isBsc) return deployMainBsc(deployer);
  return Promise.reject(new Error('unknown env'));
};
