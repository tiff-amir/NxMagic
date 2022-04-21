const path = require('path');

const { readFile, writeFile } = require('./utils/fs');
const { fromWei, toWei } = require('../solidity/test/utils/number');
const { deploy, getDeployedContract } = require('./utils/contract');
const { getWallet, setProviderType, getOptions } = require('./utils/ether');
const { addLiquidity, approve } = require('./utils/token');
const appConfig = require('../appConfig.json');
const { ROOT_PATH } = require('../constants/path');

const type = process.argv[2];

const withdrawTokens = async (contract) => {
  const [wallet, options] = await Promise.all([getWallet(), getOptions({ gasLimit: 100000 })]);
  const balance = await contract.unlockedBalanceOf(wallet.address);
  const balanceEthers = fromWei(balance, appConfig.token.decimals);
  if (!balanceEthers) {
    const teamAmount = toWei(appConfig.token.tokenomics.team, appConfig.token.decimals);
    let tx = await contract.withdrawTokens(2, teamAmount, options);
    await tx.wait();
    const liquidityAmount = toWei(appConfig.token.tokenomics.liquidity, appConfig.token.decimals);
    const liquidityContractAmount = await contract.liquidityAmount();
    const liquidityContractAmountEthers = fromWei(
      liquidityContractAmount, appConfig.token.decimals,
    );
    if (liquidityContractAmountEthers !== appConfig.token.tokenomics.liquidity) {
      tx = await contract.withdrawTokens(1, liquidityAmount, options);
      await tx.wait();
      await approve(contract.address, { gasLimit: 100000, approveAmount: liquidityAmount });
      await addLiquidity({
        tokenAddress: contract.address,
        amountToken: liquidityAmount,
        amountETH: toWei(1, 18),
        gasLimit: 5000000,
      });
    }
  }
};

const update = async () => {
  let contract;
  setProviderType(type);
  const address = await readFile(path.join(ROOT_PATH, '_temp/deploy-info/address'));
  if (address) {
    contract = await getDeployedContract();
  } else {
    contract = await deploy('test');
  }
  if (process.argv[2] !== 'main') await withdrawTokens(contract);
  const prevAddress = appConfig.token.address;
  const data = JSON.stringify(appConfig, null, 2)
    .replace(new RegExp(prevAddress, 'gi'), contract.address.toLowerCase());
  await writeFile(path.join(ROOT_PATH, 'appConfig.json'), data);
};

update();
