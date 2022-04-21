const assert = require('assert');

const getEnv = require('./utils/deploy');
const { toWei } = require('../utils/number');
const appConfig = require('../../../appConfig.json');

const Token = artifacts.require(`./${appConfig.token.name}.sol`);

require('chai').use(require('chai-as-promised')).should();

contract(Token, (accounts) => {
  const env = getEnv();

  describe('withdraw', async function desc() {
    this.timeout(100000);
    beforeEach(async () => {
      await env.deploy('withdraw');
    });

    it('should withdraw', async () => {
      await env('token').methods['decrease(address)'](accounts[2], {
        from: accounts[1], value: toWei(appConfig.token.decreaseFee, appConfig.token.decimals),
      });
      const contractBalance = await env('w3').eth.getBalance(env('token').address);
      const accountBalance = await env('w3').eth.getBalance(accounts[0]);
      await env('token').withdraw(toWei(appConfig.token.decreaseFee, appConfig.token.decimals));
      const contractBalanceAfter = await env('w3').eth.getBalance(env('token').address);
      const accountBalanceAfter = await env('w3').eth.getBalance(accounts[0]);
      assert.strictEqual(
        contractBalance.toString(),
        toWei(appConfig.token.decreaseFee, appConfig.token.decimals),
        'contract balance is correct',
      );
      assert.strictEqual(contractBalanceAfter.toString(), String(0), 'after contract balance is correct');
      assert.strictEqual(
        Number(accountBalanceAfter.toString()) - Number(accountBalance.toString()) > 0,
        true,
        'after balance is correct',
      );
    });
  });
});
