const assert = require('assert');

const getEnv = require('./utils/deploy');
const { toWei, fromWei } = require('../utils/number');
const appConfig = require('../../../appConfig.json');

const Token = artifacts.require(`./${appConfig.token.name}.sol`);

require('chai').use(require('chai-as-promised')).should();

contract(Token, (accounts) => {
  const env = getEnv();

  describe('increase', async function desc() {
    this.timeout(100000);
    beforeEach(async () => {
      await env.deploy('increase');
    });

    it('should increase balance', async () => {
      await env('token').transfer(accounts[1], toWei(1000));
      await env('token').increase(1000000, { from: accounts[1] });
      const balance = await env('token').balanceOf(accounts[1]);
      assert.strictEqual(balance.toString(), toWei(1000 * 1000000 + 1000), 'account balance is correct');
      const unlockedBalance = await env('token').unlockedBalanceOf(accounts[1]);
      assert.strictEqual(unlockedBalance.toString(), toWei(1000), 'unlockedBalance balance is correct');
      const lockedBalance = await env('token').lockedBalanceOf(accounts[1]);
      assert.strictEqual(lockedBalance.toString(), toWei(1000 * 1000000), 'lockedBalance balance is correct');
    });

    it('should not increase balance if x too big', async () => {
      await env('token').transfer(accounts[2], toWei(1000));
      let err;
      try {
        await env('token').increase(1000001, { from: accounts[2] });
      } catch (e) {
        err = e.message;
      }
      assert.strictEqual(err.includes('NxMagic:too big x'), true, 'revert x too big');
    });

    it('should second increase cancel first increase', async () => {
      await env('token').transfer(accounts[3], toWei(1000));
      await env('token').increase(2, { from: accounts[3] });
      await env('token').increase(3, { from: accounts[3] });

      const balance = await env('token').balanceOf(accounts[3]);
      assert.strictEqual(balance.toString(), toWei(1000 * 3 + 1000), 'account balance is correct');
      const unlockedBalance = await env('token').unlockedBalanceOf(accounts[3]);
      assert.strictEqual(unlockedBalance.toString(), toWei(1000), 'unlockedBalance balance is correct');
      const lockedBalance = await env('token').lockedBalanceOf(accounts[3]);
      assert.strictEqual(lockedBalance.toString(), toWei(1000 * 10000), 'lockedBalance balance is correct');
    });
  });
});
