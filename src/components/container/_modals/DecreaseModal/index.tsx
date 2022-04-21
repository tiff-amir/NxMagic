import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import View from '@presentation/_modals/DecreaseModal';
import { getAccountAddress, getAccountBalance, getAccountFullBalance } from '@ducks/account/selectors';
import { checkDecreasing, getDecreaseError } from '@ducks/umill/selectors';
import { umillDecrease } from '@ducks/umill';
import { ADDRESS_PATTERN } from '@constants/patterns';
import ToastContext from '@context/toast';
import useTranslation from '@hooks/useTranslation';
import appConfig from 'appConfig.json';

type Props = {
  onClose: () => void
};

const DecreaseModal: FC<Props> = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const prevDecreaseError = useRef('');
  const prevDecreasing = useRef(false);
  const address = useSelector(getAccountAddress);
  const fullBalance = useSelector(getAccountFullBalance);
  const balance = useSelector(getAccountBalance);
  const isDecreasing = useSelector(checkDecreasing);
  const decreaseError = useSelector(getDecreaseError);
  const [isAction, setAction] = useState(false);
  const [decreaseAddress, setDecreaseAddress] = useState('');
  const { open: openToast } = useContext(ToastContext);

  useEffect(() => {
    if (decreaseError === prevDecreaseError.current) return;
    prevDecreaseError.current = decreaseError;
    if (decreaseError) openToast(t('_errors.unknown'), { type: 'error' });
  }, [decreaseError, openToast, t]);

  useEffect(() => {
    if (isDecreasing === prevDecreasing.current) return;
    prevDecreasing.current = isDecreasing;
    if (!isDecreasing && !decreaseError) {
      openToast(t('DecreaseModal.decreased'), { type: 'success' });
      onClose();
    }
  }, [decreaseError, isDecreasing, onClose, openToast, t]);

  const decreaseHandler = useCallback(() => {
    setAction(true);
    if (!(!decreaseAddress || ADDRESS_PATTERN.test(decreaseAddress))) return;
    if (fullBalance === balance && address === decreaseAddress) {
      openToast(t('DecreaseModal.decreased', {
        balance: fullBalance, symbol: appConfig.token.symbol,
      }), { type: 'success' });
    } else {
      openToast(t('DecreaseModal.decreasing'), { autoClose: 1000 });
      dispatch(umillDecrease(decreaseAddress || address));
    }
  }, [address, balance, decreaseAddress, dispatch, fullBalance, openToast, t]);

  const changeHandler = useCallback((value) => {
    setAction(false);
    setDecreaseAddress(value);
  }, []);

  return (
    <View
      ownAddress={address}
      withFee={decreaseAddress !== address && ADDRESS_PATTERN.test(decreaseAddress)}
      decreaseFee={appConfig.token.decreaseFee}
      rootSymbol={appConfig.rootToken.symbol}
      isAddressIncorrect={isAction && decreaseAddress && !ADDRESS_PATTERN.test(decreaseAddress)}
      onChange={changeHandler}
      onClose={onClose}
      address={decreaseAddress}
      isDecreasing={isDecreasing}
      onDecrease={decreaseHandler}
    />
  );
};

export default DecreaseModal;
