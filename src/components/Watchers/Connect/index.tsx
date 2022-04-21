import { FC, useContext, useEffect, useRef } from 'react';

import useTranslation from '@hooks/useTranslation';
import { useSelector } from 'react-redux';
import { getConnectError } from '@ducks/account/selectors';
import ToastContext from '@context/toast';
import { getErrorKey } from '@utils/error';

const ConnectWatcher: FC = () => {
  const { t } = useTranslation();
  const connectError = useSelector(getConnectError);
  const prevConnectError = useRef(connectError);
  const { open } = useContext(ToastContext);

  useEffect(() => {
    if (!prevConnectError.current && connectError) {
      open(t(getErrorKey(connectError)), { type: 'error' });
    }
    prevConnectError.current = connectError;
  }, [connectError, open, t]);

  return null;
};

export default ConnectWatcher;
