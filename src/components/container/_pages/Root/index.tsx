import React, { FC, useCallback, useContext, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DecreaseModal from '@container/_modals/DecreaseModal';
import View from '@presentation/_pages/Root';
import { checkConnecting, getAccountAddress, getAccountBalance } from '@ducks/account/selectors';
import { umillIncrease } from '@ducks/umill';
import { checkIncreasing, getIncreaseError } from '@ducks/umill/selectors';
import ToastContext from '@context/toast';
import useTranslation from '@hooks/useTranslation';
import ModalContext from '@context/modal';
import appConfig from 'appConfig.json';
import ConnectWalletModal from '@container/_modals/ConnectWalletModal';

const RootPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const prevIncreaseError = useRef('');
  const prevIncreasing = useRef(false);
  const balance = useSelector(getAccountBalance);
  const address = useSelector(getAccountAddress);
  const isConnecting = useSelector(checkConnecting);
  const isIncreasing = useSelector(checkIncreasing);
  const increaseError = useSelector(getIncreaseError);
  const maxIncrease = Math.floor(appConfig.token.maxLockedAmount / balance);
  const [increase, setIncrease] = useState(10);
  const { open: openToast } = useContext(ToastContext);
  const { open: openModal, close: closeModal } = useContext(ModalContext);

  useEffect(() => {
    if (increaseError === prevIncreaseError.current) return;
    prevIncreaseError.current = increaseError;
    if (increaseError) openToast(t('_errors.unknown'), { type: 'error' });
  }, [increaseError, openToast, t]);

  useEffect(() => {
    if (isIncreasing === prevIncreasing.current) return;
    prevIncreasing.current = isIncreasing;
    if (!isIncreasing && !increaseError) {
      openToast(t('RootPage.increased'), { type: 'success' });
    }
  }, [increaseError, isIncreasing, openToast, t]);

  const increaseChangeHandler = useCallback((value) => {
    setIncrease(value);
  }, []);

  const connectHandler = useCallback(() => {
    const id = openModal(<ConnectWalletModal onClose={() => closeModal(id)} />);
  }, [closeModal, openModal]);

  const increaseHandler = useCallback(() => {
    openToast(t('RootPage.increasing'), { autoClose: 1000 });
    dispatch(umillIncrease(Math.min(increase, maxIncrease)));
  }, [t, openToast, dispatch, increase, maxIncrease]);

  const decreaseHandler = useCallback(() => {
    const id = openModal(<DecreaseModal onClose={() => closeModal(id)} />);
  }, [openModal, closeModal]);

  return (
    <View
      disabled={isIncreasing}
      increase={increase}
      increaseResult={increase ? Math.min(increase, maxIncrease) * balance + balance : balance}
      contractAddress={appConfig.token.address}
      contractLink={appConfig.token.links.contractLink}
      symbol={appConfig.token.symbol}
      tokenName={appConfig.token.name}
      telegramLink={appConfig.webApp.links.telegram}
      githubLink={appConfig.webApp.links.github}
      redditLink={appConfig.webApp.links.reddit}
      whitepaperLink={appConfig.webApp.links.whitepaper}
      connectRequired={!address}
      isConnecting={isConnecting}
      onIncreaseChange={increaseChangeHandler}
      onConnect={connectHandler}
      onIncrease={increaseHandler}
      onDecrease={decreaseHandler}
      increaseLimit={maxIncrease}
    />
  );
};

export default RootPage;
