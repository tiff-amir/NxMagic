import React, { ReactNode, FC, useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import cn from 'classnames';

import appConfig from 'appConfig.json';
import Loader from '@common/Loader';
import Header from '@container/Header';
import useTranslation from '@hooks/useTranslation';
import { DEFAULT_TITLE } from '@constants/general';
import { checkConnecting, getAccountAddress } from '@ducks/account/selectors';
import { accountReconnect } from '@ducks/account';
import svg from '@assets/icons/index.svg';
import { useRouter } from 'next/router';
import Managers from 'src/components/Managers';
import Watchers from 'src/components/Watchers';
import { AUTHORIZED_ROUTE_LIST, ROOT } from '@constants/routing';
import { checkMatch } from '@utils/router';
import icon32 from '@assets/images/favicon/favicon-32x32.png';
import icon16 from '@assets/images/favicon/favicon-16x16.png';
import favicon from '@assets/images/favicon/favicon.ico';

import css from './Layout.module.scss';

type Props = {
  children?: ReactNode
};

const STICKY_HEADER_OFFSET = 70;

const Layout: FC<Props> = ({ children = null }: Props) => {
  const sticky = useRef(false);
  const content = useRef<HTMLDivElement | null>(null);
  const stickyHeader = useRef<HTMLDivElement | null>(null);
  const { t, ready } = useTranslation();
  const router = useRouter();
  const address = useSelector(getAccountAddress);
  const mounted = useRef<boolean>(false);
  const [initialConnecting, setInitialConnecting] = useState(Boolean(address));
  const isChangedConnectingState = useRef<boolean>(false);
  const isConnecting = useSelector(checkConnecting);
  const dispatch = useDispatch();
  const isAuthorizedPath = AUTHORIZED_ROUTE_LIST.some((route) => checkMatch(router, route));
  const scrollHandler = useCallback(() => {
    if (content.current) {
      const { scrollTop } = content.current;
      const updatedStickyHeader = scrollTop >= STICKY_HEADER_OFFSET;
      if (updatedStickyHeader === sticky.current) return;
      if (updatedStickyHeader) {
        stickyHeader.current.classList.add(css['stickyHeaderContainer--visible']);
      } else {
        stickyHeader.current.classList.remove(css['stickyHeaderContainer--visible']);
      }
      sticky.current = updatedStickyHeader;
    }
  }, []);
  useEffect(() => {
    if (isAuthorizedPath && !isConnecting && !address) router.replace(ROOT);
  }, [isAuthorizedPath, isConnecting, address, router]);
  useEffect(() => {
    if (!mounted.current && address) dispatch(accountReconnect());
    mounted.current = true;
  }, [address, dispatch]);
  useEffect(() => {
    if (!isChangedConnectingState.current && isConnecting) isChangedConnectingState.current = true;
    if (isChangedConnectingState.current && !isConnecting) setInitialConnecting(false);
  }, [isConnecting]);
  const isRoot = checkMatch(router, ROOT);

  const getContent = (): ReactNode => (
    <>
      <div ref={content} onScroll={scrollHandler} className={css.content}>
        <div className={css.headerContainer}>
          <Header className={css.header} />
        </div>
        <div className={cn(css.mainContent, { [css['mainContent--full']]: !isRoot })}>
          {(isAuthorizedPath && isConnecting) || (isAuthorizedPath && !address) ? (
            <Loader />
          ) : children}
        </div>
      </div>
      <div ref={stickyHeader} className={css.stickyHeaderContainer}>
        <Header small className={css.stickyHeader} />
      </div>
    </>
  );

  return (
    <div className={css.wrapper}>
      <Head>
        <title>{ready ? t('_common.title') : DEFAULT_TITLE}</title>
        <meta charSet="utf-8" />

        <link rel="icon" type="image/png" sizes="32x32" href={icon32.src} />
        <link rel="icon" type="image/png" sizes="16x16" href={icon16.src} />
        <link rel="icon" type="image/x-icon" href={favicon.src} />

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={t('_common.description')} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Original+Surfer&display=swap" rel="stylesheet" />
        <meta property="og:title" content={ready ? t('_common.title') : DEFAULT_TITLE} />
        <meta property="og:image" content={appConfig.webApp.links.logo} />
        <meta property="og:description" content={t('_common.description')} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <script src="/_next/static/chunks/inobounce.js" />
      </Head>
      <svg
        className={css.svg}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className={css.Layout}>
        {!ready && (<h1>Please wait...</h1>)}
        {ready && (initialConnecting ? getContent() : (
          <Managers>
            <Watchers />
            {getContent()}
          </Managers>
        ))}
      </div>
    </div>
  );
};

export default Layout;
