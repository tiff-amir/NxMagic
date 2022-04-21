const { deploy } = require('../../../scripts/utils/contract');
const { getOptions, getWallet, getBalance } = require('../../../scripts/utils/ether');
const { addLiquidity, approve, sell } = require('../../../scripts/utils/token');
const { toWei, fromWei } = require('../utils/number');
const appConfig = require('../../../appConfig.json');

describe('balance', () => {
  let contract;
  let wallet;
  beforeAll(async () => {
    contract = await deploy('test');
    wallet = await getWallet();
    const options = await getOptions({ gasLimit: 100000 });
    const liquidityAmount = toWei(appConfig.token.tokenomics.liquidity, appConfig.token.decimals);
    const teamAmount = toWei(appConfig.token.tokenomics.team, appConfig.token.decimals);
    let tx = await contract.withdrawTokens(1, liquidityAmount, options);
    await tx.wait();
    tx = await contract.withdrawTokens(2, teamAmount, options);
    await tx.wait();
    await approve(contract.address, { gasLimit: 100000, approveAmount: liquidityAmount });
    await addLiquidity({
      tokenAddress: contract.address,
      amountToken: liquidityAmount,
      amountETH: toWei(1, 18),
      gasLimit: 5000000,
    });
    await approve(contract.address, {
      gasLimit: 100000,
      approveAmount: toWei(appConfig.token.tokenomics.team, appConfig.token.decimals),
    });
    tx = await contract.setMaxLockedAmount(
      toWei(appConfig.token.maxLockedAmount, appConfig.token.decimals), options,
    );
    await tx.wait();
  });

  it('should have correct balance', async () => {
    const balance = await contract.balanceOf(wallet.address);
    const balanceEthers = fromWei(balance.toString(), appConfig.token.decimals);
    expect(balanceEthers).toBe(Number(appConfig.token.tokenomics.team));
  });

  it('should sell not locked amount', async () => {
    const amount = await contract.balanceOf(wallet.address);
    const balance = await getBalance(wallet.address);
    const amountEthers = fromWei(amount.toString(), appConfig.token.decimals);
    const balanceEthers = fromWei(balance.toString(), 18);
    await sell({
      gasLimit: 5000000,
      tokenAddress: contract.address,
      amountToken: toWei(Math.round(amountEthers * 0.1), appConfig.token.decimals),
    });
    const balanceAfter = await getBalance(wallet.address);
    const balanceAfterEthers = fromWei(balanceAfter.toString(), 18);
    expect(balanceAfterEthers).toBeGreaterThan(balanceEthers);
  });

  it('should not sell locked amount', async () => {
    const amount = await contract.balanceOf(wallet.address);
    const balance = await getBalance(wallet.address);
    const options = await getOptions({ gasLimit: 100000 });
    const amountEthers = fromWei(amount.toString(), appConfig.token.decimals);
    const balanceEthers = fromWei(balance.toString(), 18);

    const tx = await contract.increase(2, options);
    await tx.wait();
    const increasedAmount = await contract.balanceOf(wallet.address);
    const increasedAmountEthers = fromWei(increasedAmount.toString(), appConfig.token.decimals);
    expect(Math.round(increasedAmountEthers / amountEthers)).toEqual(3);
    let err = '';
    try {
      await sell({
        gasLimit: 5000000,
        tokenAddress: contract.address,
        amountToken: toWei(Math.round(increasedAmountEthers), appConfig.token.decimals),
      });
    } catch (e) {
      err = e.message;
    }
    const balanceAfter = await contract.balanceOf(wallet.address);
    const balanceAfterEthers = fromWei(balanceAfter.toString(), 18);
    expect(err.includes('transaction failed')).toBeTruthy();
    expect((balanceEthers / balanceAfterEthers) * 100).toBeLessThanOrEqual(1);
  });

  it('should not sell double increase locked amount', async () => {
    let tx = await contract['decrease()']();
    await tx.wait();
    const amount = await contract.balanceOf(wallet.address);
    const balance = await getBalance(wallet.address);
    const options = await getOptions({ gasLimit: 100000 });
    const amountEthers = fromWei(amount.toString(), appConfig.token.decimals);
    const balanceEthers = fromWei(balance.toString(), 18);

    tx = await contract.increase(2, options);
    await tx.wait();
    tx = await contract.increase(3, options);
    await tx.wait();

    const increasedAmount = await contract.balanceOf(wallet.address);
    const increasedAmountEthers = fromWei(increasedAmount.toString(), appConfig.token.decimals);
    expect(Math.round(increasedAmountEthers / amountEthers)).toEqual(4);
    let err = '';
    try {
      await sell({
        gasLimit: 5000000,
        tokenAddress: contract.address,
        amountToken: toWei(Math.round((increasedAmountEthers / 3) * 2), appConfig.token.decimals),
      });
    } catch (e) {
      err = e.message;
    }
    const balanceAfter = await getBalance(wallet.address);
    const balanceAfterEthers = fromWei(balanceAfter.toString(), 18);
    expect(err.includes('transaction failed')).toBeTruthy();
    expect(Math.floor(balanceAfterEthers * 100) / 100)
      .toEqual(Math.floor(balanceEthers * 100) / 100);
  });

  it('should sell not locked after double increasing amount', async () => {
    let tx = await contract['decrease()']();
    await tx.wait();
    const amount = await contract.balanceOf(wallet.address);
    const options = await getOptions({ gasLimit: 100000 });
    const amountEthers = fromWei(amount.toString(), appConfig.token.decimals);

    tx = await contract.increase(2, options);
    await tx.wait();
    tx = await contract.increase(3, options);
    await tx.wait();

    const sellAmountEthers = Math.round(amountEthers / 2);
    await sell({
      gasLimit: 5000000,
      tokenAddress: contract.address,
      amountToken: toWei(sellAmountEthers, appConfig.token.decimals),
    });
    const unlockedAmountAfter = await contract.unlockedBalanceOf(wallet.address);
    const unlockedAmountAfterEthers = fromWei(
      unlockedAmountAfter.toString(), appConfig.token.decimals,
    );
    expect(unlockedAmountAfterEthers).toEqual(amountEthers - sellAmountEthers);
  });

  it('should decrease on transferring all unlocked tokens', async () => {
    let tx = await contract['decrease()']();
    await tx.wait();
    const amount = await contract.balanceOf(wallet.address);
    const options = await getOptions({ gasLimit: 100000 });
    const amountEthers = fromWei(amount.toString(), appConfig.token.decimals);

    tx = await contract.increase(2, options);
    await tx.wait();

    await sell({
      gasLimit: 5000000,
      tokenAddress: contract.address,
      amountToken: toWei(amountEthers, appConfig.token.decimals),
    });
    const amountAfter = await contract.balanceOf(wallet.address);
    const amountAfterEthers = fromWei(amountAfter.toString(), appConfig.token.decimals);
    expect(amountAfterEthers).toEqual(0);
  });
});
