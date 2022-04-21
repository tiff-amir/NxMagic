const assert = require('assert');

const getEnv = require('./utils/deploy');
const { toWei } = require('../utils/number');
const appConfig = require('../../../appConfig.json');

const Token = artifacts.require(`./${appConfig.token.name}.sol`);

require('chai').use(require('chai-as-promised')).should();

contract(Token, (accounts) => {
  const env = getEnv();

  describe('increaseAfterSomeoneDecrease', async function desc() {
    this.timeout(100000);
    beforeEach(async () => {
      await env.deploy('increaseAfterSomeoneDecrease');
    });

    it('should not increase balance if value is 0', async () => {
      await env('token').transfer(accounts[1], toWei(1000));
      await env('token').transfer(accounts[2], toWei(1000));
      await env('token').increase(1000000, { from: accounts[1] });
      let err = '';
      try {
        await env('token').increaseAfterSomeoneDecrease(1000000, accounts[1], { from: accounts[2] });
      } catch (e) {
        err = e.message;
      }
      assert.strictEqual(err.includes('NxMagic:incorrect value'), true, 'revert someone decrease');
      const amountAccount1 = await env('token').balanceOf(accounts[1]);
      const amountAccount2 = await env('token').balanceOf(accounts[2]);
      assert.strictEqual(amountAccount1.toString(), toWei(1000 * 1000000 + 1000), 'account 1 balance is correct');
      assert.strictEqual(amountAccount2.toString(), toWei(1000), 'account 2 balance is correct');
    });

    it('should not increase balance if value is less then decrease fee', async () => {
      await env('token').transfer(accounts[3], toWei(1000));
      await env('token').transfer(accounts[4], toWei(1000));
      await env('token').increase(1000000, { from: accounts[3] });
      let err = '';
      try {
        await env('token').increaseAfterSomeoneDecrease(1000000, accounts[3], {
          from: accounts[4],
          value: toWei(appConfig.token.decreaseFee - 0.00001, appConfig.token.decimals),
        });
      } catch (e) {
        err = e.message;
      }
      assert.strictEqual(err.includes('NxMagic:incorrect value'), true, 'revert someone decrease');
      const amountAccount1 = await env('token').balanceOf(accounts[3]);
      const amountAccount2 = await env('token').balanceOf(accounts[4]);
      assert.strictEqual(amountAccount1.toString(), toWei(1000 * 1000000 + 1000), 'account 1 balance is correct');
      assert.strictEqual(amountAccount2.toString(), toWei(1000), 'account 2 balance is correct');
    });

    it('should increase first account balance and decrease second account balance', async () => {
      await env('token').transfer(accounts[5], toWei(1000));
      await env('token').transfer(accounts[6], toWei(1000));
      await env('token').increase(1000000, { from: accounts[5] });
      await env('token').increaseAfterSomeoneDecrease(1000000, accounts[5], {
        from: accounts[6], value: toWei(appConfig.token.decreaseFee, appConfig.token.decimals),
      });
      const amountAccount1 = await env('token').balanceOf(accounts[5]);
      const amountAccount2 = await env('token').balanceOf(accounts[6]);
      const contractBalance = await env('w3').eth.getBalance(env('token').address);
      assert.strictEqual(amountAccount1.toString(), toWei(1000), 'account 1 balance is correct');
      assert.strictEqual(amountAccount2.toString(), toWei(1000 * 1000000 + 1000), 'account 2 balance is correct');
      assert.strictEqual(
        contractBalance.toString(),
        toWei(appConfig.token.decreaseFee, appConfig.token.decimals),
        'contract balance is correct',
      );
    });
  });
});
