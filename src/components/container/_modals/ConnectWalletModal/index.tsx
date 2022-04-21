import React, { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import View from '@presentation/_modals/ConnectWalletModal';
import * as metaMask from '@api/metaMask';
import { accountConnect } from '@ducks/account';
import { WalletConnector } from 'src/types/account';
import { checkConnecting, getAccountAddress } from '@ducks/account/selectors';
import { feature } from '@utils/featureConfig';

type Props = {
  onClose: () => void
};

const ConnectWalletModal: FC<Props> = ({ onClose }: Props) => {
  const isMetaMaskInstalled = metaMask.checkInstalled();
  const address = useSelector(getAccountAddress);
  const isConnecting = useSelector(checkConnecting);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!feature('walletConnect')) {
      dispatch(accountConnect(WalletConnector.MetaMask));
      onClose();
    }
  }, [dispatch, isMetaMaskInstalled, onClose]);

  useEffect(() => {
    if (address) onClose();
  }, [address, onClose]);

  const walletConnectHandler = useCallback(() => {
    dispatch(accountConnect(WalletConnector.WalletConnect));
  }, [dispatch]);

  const metaMaskHandler = useCallback(() => {
    dispatch(accountConnect(WalletConnector.MetaMask));
  }, [dispatch]);

  return feature('walletConnect') ? (
    <View
      disabled={isConnecting}
      onClose={onClose}
      onMetaMask={metaMaskHandler}
      onWalletConnect={walletConnectHandler}
    />
  ) : null;
};

export default ConnectWalletModal;
