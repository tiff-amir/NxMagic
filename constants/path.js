module.exports = {
  ROOT_PATH: __dirname.replace(/NxMagic.+$/, 'NxMagic'),
  ABI_LINK_MAIN: 'https://api.bscscan.com/api?module=contract&action=getabi&address={{address}}&format=raw',
  ABI_LINK_TEST: 'https://api-testnet.bscscan.com/api?module=contract&action=getabi&address={{address}}&format=raw',
};
