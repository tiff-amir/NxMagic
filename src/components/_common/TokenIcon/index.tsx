import React, { FC, useState, useEffect, useRef, useCallback } from 'react';
import cn from 'classnames';

import { ADDRESS_PATTERN } from '@constants/patterns';
import { AddressType } from 'src/types/contract';
import { same } from '@utils/address';
import nxmagicImage from '@assets/images/NxMagic-token.png';
import emptyImage from '@assets/images/empty-token.png';
import appConfig from 'appConfig.json';

import css from './TokenIcon.module.scss';

type Props = {
  className?: string
  address: AddressType
};

const TokenIcon: FC<Props> = ({ address, className = '' }: Props) => {
  const [isError, updateError] = useState(false);
  const mounted = useRef<boolean>();
  const src = same(address, appConfig.token.address)
    ? nxmagicImage.src
    : `https://tokens.pancakeswap.finance/images/${address}.png`;
  useEffect(() => {
    if (mounted.current) updateError(false);
    mounted.current = true;
  }, [address]);

  const onError = useCallback(() => {
    updateError(true);
  }, []);

  const imageSrc = !ADDRESS_PATTERN.test(address) || isError ? emptyImage.src : src;
  return (
    <img onError={onError} className={cn(css.TokenIcon, className)} src={imageSrc} alt="" />
  );
};

export default TokenIcon;
