const assert = require('assert');

const getEnv = require('./utils/deploy');
const { toWei } = require('../utils/number');
const appConfig = require('../../../appConfig.json');

const Token = artifacts.require(`./${appConfig.token.name}.sol`);

require('chai').use(require('chai-as-promised')).should();

contract(Token, (accounts) => {
  const env = getEnv();

  describe('transfer', async function desc() {
    this.timeout(100000);
    beforeEach(async () => {
      await env.deploy('transfer');
    });

    it('should not transfer locked balance', async () => {
      await env('token').transfer(accounts[3], toWei(1000));
      await env('token').increase(1000000, { from: accounts[3] });
      let err;
      try {
        await env('token').transfer(accounts[0], toWei(1001), { from: accounts[3] });
      } catch (e) {
        err = e.message;
      }
      assert.strictEqual(err.includes('NxMagic:cannot transfer locked balance'), true, 'revert transferring locked balance');
    });

    it('should transfer not locked balance with decreasing locked balance', async () => {
      await env('token').transfer(accounts[4], toWei(1000));
      await env('token').increase(1000000, { from: accounts[4] });
      await env('token').transfer(accounts[0], toWei(1000), { from: accounts[4] });
      const amount = await env('token').balanceOf(accounts[4]);
      assert.strictEqual(amount.toString(), toWei(0), 'account balance is correct');
    });
  });
});
