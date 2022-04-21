const assert = require('assert');

const getEnv = require('./utils/deploy');
const { toWei } = require('../utils/number');
const appConfig = require('../../../appConfig.json');

const Token = artifacts.require(`./${appConfig.token.name}.sol`);

require('chai').use(require('chai-as-promised')).should();

contract(Token, (accounts) => {
  const env = getEnv();

  describe('decrease', async function desc() {
    this.timeout(100000);
    beforeEach(async () => {
      await env.deploy('decrease');
    });

    it('should decrease balance', async () => {
      await env('token').transfer(accounts[1], toWei(1000));
      await env('token').increase(1000000, { from: accounts[1] });
      const amount = await env('token').balanceOf(accounts[1]);
      assert.strictEqual(amount.toString(), toWei(1000 * 1000000 + 1000), 'account balance is correct');
      await env('token').methods['decrease()']({ from: accounts[1] });
      const amountAfter = await env('token').balanceOf(accounts[1]);
      assert.strictEqual(amountAfter.toString(), toWei(1000), 'account balance is correct');
    });

    it('should decrease not own balance', async () => {
      const testAccount = accounts[2];
      await env('token').transfer(testAccount, toWei(1000));
      await env('token').increase(1000000, { from: testAccount });
      const amount = await env('token').balanceOf(testAccount);
      assert.strictEqual(amount.toString(), toWei(1000 * 1000000 + 1000), 'account balance is correct');
      await env('token').methods['decrease(address)'](testAccount, {
        from: accounts[0], value: toWei(appConfig.token.decreaseFee, appConfig.token.decimals),
      });
      const amountAfter = await env('token').balanceOf(testAccount);
      const contractBalance = await env('w3').eth.getBalance(env('token').address);
      assert.strictEqual(amountAfter.toString(), toWei(1000), 'account balance is correct');
      assert.strictEqual(
        contractBalance.toString(),
        toWei(appConfig.token.decreaseFee, appConfig.token.decimals),
        'contract balance is correct',
      );
    });
  });
});
