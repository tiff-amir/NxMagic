import React, { FC } from 'react';

import ViewportSizeWatcher from './ViewportSize';
import ConnectWatcher from './Connect';
import UpdateWatcher from './Update';

const Watchers: FC = () => {
  const withWindow = typeof window !== 'undefined';
  return (withWindow && (
    <>
      <ViewportSizeWatcher />
      <ConnectWatcher />
      <UpdateWatcher />
    </>
  ));
};

export default Watchers;
