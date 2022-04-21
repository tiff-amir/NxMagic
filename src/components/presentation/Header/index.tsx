import React, { FC } from 'react';
import cn from 'classnames';

import TextButton, { CONTAINED_TYPE, TEXT_TYPE } from '@common/TextButton';
import useTranslation from '@hooks/useTranslation';
import { feature } from '@utils/featureConfig';
import { ROOT } from '@constants/routing';

import css from './Header.module.scss';

type Props = {
  className?: string
  address?: string
  buyIcon?: string
  isConnecting: boolean
  small: boolean
  onBuy?: () => void
  onConnect?: () => void
  onDisconnect?: () => void
  buyLink?: string
};

const Header: FC<Props> = (
  {
    className = '',
    address = '',
    buyIcon,
    onBuy,
    onConnect,
    onDisconnect,
    isConnecting,
    small,
    buyLink,
  }: Props,
) => {
  const { t } = useTranslation();
  return (
    <div className={cn(css.Header, { [css['Header--small']]: small }, className)}>
      <div className={css.content}>
        {(onConnect || isConnecting) && (
          <div className={css.buttonContainer}>
            <TextButton
              className={css.button}
              icon={feature('walletConnect') ? 'wallet' : 'metamask'}
              type={TEXT_TYPE}
              disabled={isConnecting}
              text={t('Header.connect')}
              onClick={onConnect}
            />
          </div>
        )}
        {onDisconnect && (
          <div className={css.buttonContainer}>
            <TextButton
              icon="exit"
              className={css.button}
              type={TEXT_TYPE}
              text={t('Header.disconnect', { address: address.substring(0, 7) })}
              onClick={onDisconnect}
            />
          </div>
        )}
        {(buyLink || onBuy) ? (
          <div className={css.buttonContainer}>
            <TextButton
              blank
              icon={buyIcon}
              className={css.button}
              type={CONTAINED_TYPE}
              text={t('Header.buy')}
              href={buyLink}
              onClick={onBuy}
            />
          </div>
        ) : (
          <div className={css.buttonContainer}>
            <TextButton
              blank
              disabled
              icon={buyIcon}
              className={css.button}
              type={CONTAINED_TYPE}
              text={t('Header.comingSoon')}
              to={ROOT}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
