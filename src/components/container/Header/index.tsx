import React, { FC, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import View from '@presentation/Header';
import { checkConnecting, getAccountAddress } from '@ducks/account/selectors';
import { accountDisconnect } from '@ducks/account';
import ModalContext from '@context/modal';
import BuyTokenModal from '@container/_modals/BuyTokenModal';
import ConnectWalletModal from '@container/_modals/ConnectWalletModal';
import appConfig from 'appConfig.json';

type Props = {
  className?: string
  small?: boolean
};

const Header: FC<Props> = ({ className, small = false }: Props) => {
  const dispatch = useDispatch();
  const { open, close } = useContext(ModalContext);
  const address = useSelector(getAccountAddress);
  const isConnecting = useSelector(checkConnecting);
  const isIdo = Boolean(appConfig.webApp.links.ido);

  const connectHandler = useCallback(() => {
    const id = open(<ConnectWalletModal onClose={() => close(id)} />);
  }, [close, open]);

  const disconnectHandler = useCallback(() => {
    dispatch(accountDisconnect());
  }, [dispatch]);

  const openIdoModal = useCallback(() => {
    const id = open(<BuyTokenModal onClose={() => close(id)} />);
  }, [close, open]);

  const buyLink = appConfig.token.links.buyLink && !isIdo
    ? appConfig.token.links.buyLink : undefined;

  return (
    <View
      address={address}
      buyIcon={isIdo ? undefined : 'pancake'}
      small={small}
      isConnecting={isConnecting}
      onConnect={address ? undefined : connectHandler}
      onDisconnect={address && !isConnecting ? disconnectHandler : undefined}
      className={className}
      onBuy={isIdo ? openIdoModal : undefined}
      buyLink={buyLink}
    />
  );
};

export default Header;
