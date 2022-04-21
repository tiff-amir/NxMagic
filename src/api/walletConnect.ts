import QRCodeModal from '@walletconnect/qrcode-modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

import appConfig from 'appConfig.json';

export const setup = async () => {
  const provider = new WalletConnectProvider({
    qrcodeModal: QRCodeModal,
    rpc: {
      [appConfig.webApp.network.chainId]: appConfig.webApp.network.rpc,
    },
  });
  try {
    await provider.disconnect();
  } catch (e) {
    console.log(e.message);
  }
  await provider.enable();

  return provider;
};
