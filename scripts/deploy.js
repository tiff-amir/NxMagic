const { deploy } = require('./utils/contract');
const { setProviderType } = require('./utils/ether');

const type = process.argv[2];

if (setProviderType(type)) {
  deploy(type).catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else {
  console.error('Incorrect type');
  process.exit(1);
}
