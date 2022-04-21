import MetaMaskOnboarding from '@metamask/onboarding';

interface IEthereum {
  request: <T>(params: { method: string }) => Promise<T>
}

export const checkInstalled = (): boolean => MetaMaskOnboarding.isMetaMaskInstalled();

export const checkExists = (): boolean => 'ethereum' in window;

const getAddress = async (): Promise<string[]> => {
  const { ethereum } = (window as unknown as { ethereum: IEthereum });
  if (!ethereum) return [];
  const list = await ethereum.request<string[]>({ method: 'eth_requestAccounts' });
  return list || [];
};

export const connect = async (): Promise<string[]> => getAddress();
