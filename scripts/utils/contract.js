const ethers = require('ethers');
const path = require('path');
const { exec } = require('child_process');

const { ROOT_PATH } = require('../../constants/path');
const {
  readFile, checkFolder, mkdir, rimraf, folderFiles, writeFile,
} = require('./fs');
const { getWallet, getMetadata, getOptions, setProviderType, getContract } = require('./ether');
const { toWei } = require('../../solidity/test/utils/number');
const appConfig = require('../../appConfig.json');

const ORIGINAL_ROOT_NAME = appConfig.token.name;
const TEMP_ROOT_NAME = 'Root';
const ORIGINAL_ROOT_FILENAME = `${ORIGINAL_ROOT_NAME}.sol`;
const TEMP_ROOT_FILENAME = `${TEMP_ROOT_NAME}.sol`;

const TEMP_FOLDER = path.join(ROOT_PATH, '_temp');
const ABI_FOLDER = path.join(ROOT_PATH, 'solidity/abis');
const PREPARED_FOLDER = path.join(TEMP_FOLDER, 'verification-prepared');
const ORIGINAL_FOLDER = path.join(TEMP_FOLDER, 'verification-origin');
const CONTRACTS_FOLDER = path.join(ROOT_PATH, 'solidity/contracts');
const DEPLOY_INFO_FOLDER = path.join(ROOT_PATH, '_temp/deploy-info');
const DEPLOY_ADDRESS = path.join(ROOT_PATH, '_temp/deploy-info/address');

const ORIGINAL_ROOT_CONTRACT = path.join(CONTRACTS_FOLDER, ORIGINAL_ROOT_FILENAME);
const TEMP_ROOT_CONTRACT = path.join(CONTRACTS_FOLDER, TEMP_ROOT_FILENAME);

const prepareFolders = async () => {
  const tempExists = await checkFolder(TEMP_FOLDER);
  if (!tempExists) await rimraf(TEMP_FOLDER);
  const preparedExists = await checkFolder(PREPARED_FOLDER);
  const originExists = await checkFolder(ORIGINAL_FOLDER);
  const abiExists = await checkFolder(ABI_FOLDER);
  if (preparedExists) await rimraf(PREPARED_FOLDER);
  if (originExists) await rimraf(ORIGINAL_FOLDER);
  if (abiExists) await rimraf(ABI_FOLDER);
  await mkdir(PREPARED_FOLDER);
  await mkdir(ORIGINAL_FOLDER);
  await mkdir(ABI_FOLDER);
};

const setOriginList = async () => {
  const files = await folderFiles(CONTRACTS_FOLDER);
  return Promise.all(files.map((name) => {
    return readFile(path.join(CONTRACTS_FOLDER, name)).then((data) => {
      return writeFile(path.join(ORIGINAL_FOLDER, name), data);
    });
  }));
};

const deleteContractsFolderFiles = async (processRoot = false) => {
  const files = await folderFiles(CONTRACTS_FOLDER);
  return Promise.all(
    files
      .filter((name) => /\.sol$/.test(name))
      .filter((name) => name !== TEMP_ROOT_FILENAME || processRoot)
      .map((name) => {
        return rimraf(path.join(CONTRACTS_FOLDER, name));
      }),
  );
};

const createRoot = async () => new Promise((resolve, reject) => {
  exec('npm run creat-root', (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

const renameRootFile = async () => {
  let data = await readFile(TEMP_ROOT_CONTRACT);
  data = data.replace(/\/\/\sSPDX-License-Identifier.+/g, '').replace(/pragma\ssolidity.+/g, '');
  await rimraf(TEMP_ROOT_CONTRACT);
  return writeFile(
    ORIGINAL_ROOT_CONTRACT,
    `// SPDX-License-Identifier: MIT\n\npragma solidity ^0.8.0;\n\n${data}`,
  );
};

const copyMigrationFile = async () => {
  const data = await readFile(path.join(ORIGINAL_FOLDER, 'Migrations.sol'));
  return writeFile(path.join(CONTRACTS_FOLDER, 'Migrations.sol'), data);
};

const copyVerificationFile = async () => {
  const data = await readFile(ORIGINAL_ROOT_CONTRACT);
  return writeFile(path.join(PREPARED_FOLDER, ORIGINAL_ROOT_FILENAME), data);
};

const restoreFiles = async () => {
  await deleteContractsFolderFiles(true);
  const files = await folderFiles(ORIGINAL_FOLDER);
  return Promise.all(files.map((name) => {
    return readFile(path.join(ORIGINAL_FOLDER, name)).then((data) => {
      return writeFile(path.join(CONTRACTS_FOLDER, name), data);
    });
  }));
};

const deployLocally = async () => new Promise((resolve, reject) => {
  exec('npm run truffle-deploy', (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

const getArgs = () => [
  toWei(appConfig.token.totalSupply, appConfig.token.decimals),
  appConfig.token.decimals,
  toWei(appConfig.token.tokenomics.liquidity, appConfig.token.decimals),
  toWei(appConfig.token.tokenomics.team, appConfig.token.decimals),
  toWei(appConfig.token.tokenomics.marketing, appConfig.token.decimals),
];

const writeInfo = async (contract) => {
  const isFolderExists = await checkFolder(DEPLOY_INFO_FOLDER);
  if (!isFolderExists) await mkdir(DEPLOY_INFO_FOLDER);
  return writeFile(DEPLOY_ADDRESS, contract.address);
};

const deployContract = async () => {
  await deployLocally();
  const [wallet, metadata, options] = await Promise.all([
    getWallet(), getMetadata(), getOptions(),
  ]);
  const factory = new ethers.ContractFactory(metadata.abi, metadata.bytecode, wallet);
  const contract = await factory.deploy(...getArgs(), options);
  await contract.deployed();
  await writeInfo(contract);
  return contract;
};

const getDeployedContract = async () => {
  const address = await readFile(path.join(DEPLOY_INFO_FOLDER, 'address'));
  return getContract(address.replace(/\n/, '').trim(), true);
};

const deploy = async (type) => {
  if (setProviderType(type)) {
    await prepareFolders();
    await setOriginList();
    await createRoot();
    await deleteContractsFolderFiles();
    await renameRootFile();
    await copyMigrationFile();
    await copyVerificationFile();
    await deployContract();
    await restoreFiles();
    return getDeployedContract();
  }
  throw new Error('Unknown type');
};

module.exports = {
  deploy,
  getDeployedContract,
};
