import React, { FC, useCallback } from 'react';
import cn from 'classnames';

import useTranslation from '@hooks/useTranslation';
import { AddressType } from 'src/types/contract';
import Link from '@common/Link';
import Form from '@common/Form';
import Input from '@common/Input';
import TextButton, { CONTAINED_TYPE, TEXT_TYPE } from '@common/TextButton';
import StyledButton from '@common/StyledButton';
import Icon from '@common/Icon';

import css from './Root.module.scss';

type Props = {
  contractAddress: AddressType
  contractLink: string
  symbol: string
  tokenName: string
  increase: number
  increaseResult: number
  onIncreaseChange: (value: number) => void
  connectRequired: boolean
  isConnecting: boolean
  disabled: boolean
  onConnect: () => void
  onIncrease: () => void
  onDecrease: () => void
  increaseLimit: number
  telegramLink?: string
  githubLink?: string
  redditLink?: string
  whitepaperLink?: string
};

const RootPage: FC<Props> = (
  {
    contractAddress,
    contractLink,
    symbol,
    tokenName,
    increase,
    increaseResult,
    onIncreaseChange,
    connectRequired,
    isConnecting,
    disabled,
    onConnect,
    onIncrease,
    onDecrease,
    telegramLink,
    githubLink,
    redditLink,
    whitepaperLink,
    increaseLimit,
  }: Props,
) => {
  const { t } = useTranslation();

  const increaseChangeHandler = useCallback((e) => {
    onIncreaseChange(Number(e.target.value || '0'));
  }, [onIncreaseChange]);

  return (
    <>
      <div className={css.title}>
        <span className={css.titleTextMain}>{t('RootPage.title.0')}</span>
        <span className={css.titleTextRegular}>{t('RootPage.title.1')}</span>
      </div>
      <div className={css.contract}>
        <Link blank href={contractLink} className={css.contractLink}>
          {contractAddress}
        </Link>
      </div>
      <div className={css.description}>
        <span className={css.descriptionRegular}>{t('RootPage.description.0')}</span>
        <span className={css.descriptionMain}>{t('RootPage.description.1')}</span>
        <span className={css.descriptionRegular}>{t('RootPage.description.2')}</span>
        <span className={css.descriptionMain}>{t('RootPage.description.3')}</span>
      </div>
      <div className={css.increase}>
        <div className={css.increaseTitle}>
          <span className={css.increaseTitleRegular}>{t('RootPage.increase.0')}</span>
          <span className={css.increaseTitleMain}>{t('RootPage.increase.1')}</span>
          <span className={css.increaseTitleRegular}>{t('RootPage.increase.2', { tokenName })}</span>
        </div>
        <Form disabled={!increase} onSubmit={onIncrease}>
          <Input
            big
            lock={disabled}
            onChange={increaseChangeHandler}
            value={increase ? String(increase) : ''}
            className={css.increaseInput}
            warning={increaseLimit < increase && !connectRequired
              ? t('RootPage.maximumIncreaseWarning', { value: increaseLimit }) : undefined}
          />
          <div className={css.controls}>
            {connectRequired ? (
              <TextButton
                big
                disabled={isConnecting}
                type={CONTAINED_TYPE}
                text={t('RootPage.connectWallet')}
                onClick={onConnect}
                className={css.button}
              />
            ) : (
              <>
                <TextButton
                  big
                  disabled={disabled}
                  className={css.button}
                  type={TEXT_TYPE}
                  text={t('RootPage.decrease')}
                  onClick={onDecrease}
                />
                <div className={css.space} />
                <TextButton
                  big
                  disabled={!increase || disabled}
                  className={cn(css.button, css.increaseButton)}
                  type={CONTAINED_TYPE}
                  text={t('RootPage.increaseAmount')}
                  onClick={onIncrease}
                />
              </>
            )}
          </div>
        </Form>
        {Boolean(increaseResult) && !connectRequired && (
          <div className={css.increaseResult}>
            <div>
              <span className={css.increaseResultRegular}>{t('RootPage.increaseResult.0')}</span>
            </div>
            <div>
              <span className={css.increaseResultMain}>
                {t('RootPage.increaseResult.1', { symbol, value: increaseResult })}
              </span>
            </div>
          </div>
        )}
        <div className={css.footer}>
          {telegramLink && (
            <StyledButton
              blank
              className={css.footerButton}
              type={TEXT_TYPE}
              href={telegramLink}
            >
              <Icon className={css.footerIcon} name="telegram" />
              <div className={css.footerText}>{t('_common.telegram')}</div>
            </StyledButton>
          )}
          {githubLink && (
            <StyledButton
              blank
              className={css.footerButton}
              type={TEXT_TYPE}
              href={githubLink}
            >
              <Icon className={css.footerIcon} name="github" />
              <div className={css.footerText}>{t('_common.github')}</div>
            </StyledButton>
          )}
          {redditLink && (
            <StyledButton
              blank
              className={css.footerButton}
              type={TEXT_TYPE}
              href={redditLink}
            >
              <Icon className={css.footerIcon} name="reddit" />
              <div className={css.footerText}>{t('_common.reddit')}</div>
            </StyledButton>
          )}
          {whitepaperLink && (
            <StyledButton
              blank
              className={css.footerButton}
              type={TEXT_TYPE}
              href={whitepaperLink}
            >
              <Icon className={css.footerIcon} name="whitepaper" />
              <div className={css.footerText}>{t('_common.whitepaper')}</div>
            </StyledButton>
          )}
        </div>
      </div>
    </>
  );
};

export default RootPage;
