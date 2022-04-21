import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { accountUpdate } from '@ducks/account';
import { getAccountAddress } from '@ducks/account/selectors';

const WATCH_INTERVAL = 1000;

const UpdateWatcher: FC = () => {
  const dispatch = useDispatch();
  const address = useSelector(getAccountAddress);
  useEffect(() => {
    const interval = setInterval(() => {
      if (address) dispatch(accountUpdate());
    }, WATCH_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, address]);
  return null;
};

export default UpdateWatcher;
