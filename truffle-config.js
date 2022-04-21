const fs = require('fs');
const path = require('path');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const keys = require('./private-key.json');

const ROOT_PATH = __dirname.replace(/NxMagic.+$/, 'NxMagic');

const mnemonic = fs.readFileSync(path.join(ROOT_PATH, '.secret')).toString().replace(/\n/g, '').trim();

module.exports = {
  networks: {
    dev: {
      host: '176.37.0.237',
      port: 3545,
      network_id: '*',
    },
    local: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonic, 'https://bsc-dataseed1.binance.org'),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    bscTest: {
      provider: () => new HDWalletProvider([keys.test], 'https://data-seed-prebsc-1-s1.binance.org:8545', 0, 1),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  plugins: [
    'solidity-coverage',
    'truffle-contract-size',
  ],
  mocha: {

    reporter: 'eth-gas-reporter',
  },
  test_directory: './solidity/test/',
  migrations_directory: './solidity/migrations/',
  contracts_directory: './solidity/contracts/',
  contracts_build_directory: './solidity/abis/',
  compilers: {
    solc: {
      version: '^0.8.0',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
