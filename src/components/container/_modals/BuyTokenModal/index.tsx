import React, { FC } from 'react';

import View from '@presentation/_modals/BuyTokenModal';
import appConfig from 'appConfig.json';

type Props = {
  onClose: () => void
};

const BuyTokenModal: FC<Props> = ({ onClose }: Props) => {
  return (
    <View
      onClose={onClose}
      ido={appConfig.webApp.links.ido}
      whitepaper={appConfig.webApp.links.whitepaper}
    />
  );
};

export default BuyTokenModal;
