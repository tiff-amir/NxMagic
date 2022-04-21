const assert = require('assert');

const getEnv = require('./utils/deploy');
const { toWei } = require('../utils/number');
const appConfig = require('../../../appConfig.json');

const Token = artifacts.require(`./${appConfig.token.name}.sol`);

require('chai').use(require('chai-as-promised')).should();

contract(Token, (accounts) => {
  const env = getEnv();

  describe('lockedBalanceOf', async function desc() {
    this.timeout(100000);
    beforeEach(async () => {
      await env.deploy('lockedBalanceOf');
    });

    it('should returns correct unlocked balance', async () => {
      await env('token').transfer(accounts[1], toWei(1000));
      await env('token').increase(1000000, { from: accounts[1] });
      const amount = await env('token').lockedBalanceOf(accounts[1]);
      assert.strictEqual(amount.toString(), toWei(1000 * 1000000), 'account locked balance is correct');
    });
  });
});
