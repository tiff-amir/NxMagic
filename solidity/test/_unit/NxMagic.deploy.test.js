const assert = require('assert');

const appConfig = require('../../../appConfig.json');
const getEnv = require('./utils/deploy');
const { toWei } = require('../utils/number');

const Token = artifacts.require(`./${appConfig.token.name}.sol`);

require('chai').use(require('chai-as-promised')).should();

contract(Token, (accounts) => {
  const env = getEnv();

  describe('deploy', async function desc() {
    this.timeout(100000);
    beforeEach(async () => {
      await env.deploy('deploy');
    });

    it('returns correct decimals', async () => {
      const result = await env('token').decimals();
      assert.strictEqual(result.toNumber(), appConfig.token.decimals, 'decimals value is correct');
    });

    it('returns correct total supply', async () => {
      const result = await env('token').totalSupply();
      assert.strictEqual(
        result.toString(), toWei(appConfig.token.totalSupply, appConfig.token.decimals), 'total supply is correct',
      );
    });

    it('should transfer correct amount to token address', async () => {
      const amount = await env('token').balanceOf(env('token').address);
      assert.strictEqual(
        amount.toString(),
        toWei(
          appConfig.token.totalSupply - appConfig.token.tokenomics.team, appConfig.token.decimals,
        ),
        'contract balance is correct',
      );
    });

    it('should leave correct amount for the owner', async () => {
      const amount = await env('token').balanceOf(accounts[0]);
      assert.strictEqual(
        amount.toString(),
        toWei(appConfig.token.tokenomics.team, appConfig.token.decimals),
        'account balance is correct',
      );
    });
  });
});
