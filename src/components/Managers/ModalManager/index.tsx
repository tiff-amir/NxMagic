import React, {
  FC,
  useState,
  useCallback,
  cloneElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useMemo, useContext,
} from 'react';
import { useRouter } from 'next/router';
import { v1 } from 'uuid';
import queryString, { ParsedUrlQuery } from 'querystring';
import omit from 'lodash.omit';

import ModalContext from '@context/modal';
import { MODAL_QUERY_PARAM_NAME, MODAL_AUTO_OPEN_LIST } from '@constants/routing';
import {
  AUTO_START_MODAL_COMPONENT, AUTHORIZED_START_MODAL_LIST,
} from 'src/components/Managers/ModalManager/costants';
import { buildPath } from '@utils/router';
import { useSelector } from 'react-redux';
import { getAccountAddress } from '@ducks/account/selectors';
import ContextMenuContext from '@context/contextMenu';

type Props = {
  children?: ReactNode
};

const getModalList = (query: ParsedUrlQuery): string[] => {
  const param = query[MODAL_QUERY_PARAM_NAME];
  return typeof param === 'string' ? param.split(',') : [];
};

const getModalListString = (query: ParsedUrlQuery): string => {
  return getModalList(query).sort().join(',');
};

const createModalListString = (
  query: ParsedUrlQuery,
  include: string[] = [],
  exclude: string[] = [],
): string => {
  return [...getModalList(query), ...include]
    .filter((id) => !exclude.includes(id))
    .sort()
    .join(',');
};

const ModalManager: FC<Props> = ({ children }: Props) => {
  const { close } = useContext(ContextMenuContext);
  const address = useSelector(getAccountAddress);
  const mounted = useRef<boolean>(false);
  const sessionModalIdStack = useRef<string[]>([]);
  const router = useRouter();
  const { pathname, asPath, push, replace, query: params, back } = router;
  const path = buildPath(pathname, params);
  const query = useMemo(() => {
    return queryString.parse(asPath.replace(/^[^?]*\??/, ''));
  }, [asPath]);
  const prevModalList = useRef<string>(getModalListString(query));
  const [modals, setModals] = useState<Array<{
    id: string
    modal: ReactElement
  }>>([]);

  useEffect(() => {
    if (!mounted.current) {
      const modalList = getModalList(query);
      const [openList, closeList] = modalList.reduce((acc, id) => {
        if (MODAL_AUTO_OPEN_LIST.includes(id) && AUTO_START_MODAL_COMPONENT[id]
          && (address || !AUTHORIZED_START_MODAL_LIST.includes(id))) {
          acc[0].push(id);
        } else {
          acc[1].push(id);
        }
        return acc;
      }, [[], []] as Array<string[]>);
      const modalListString = createModalListString(query, [], closeList);
      const updatedQueryString = queryString.stringify({
        ...omit(query, closeList, MODAL_QUERY_PARAM_NAME),
        ...(modalListString ? { [MODAL_QUERY_PARAM_NAME]: modalListString } : {}),
      });
      const updatedAsPath = updatedQueryString.length ? [path, updatedQueryString].join('?') : path;
      if (updatedAsPath !== asPath) {
        replace(updatedAsPath).then(() => {
          setModals(openList.map((id) => {
            const Comp = AUTO_START_MODAL_COMPONENT[id];
            return { id, modal: <Comp /> };
          }));
        });
      }
    }
    mounted.current = true;
  }, [query, pathname, replace, path, asPath, address]);

  useEffect(() => {
    const modalList = getModalListString(query);
    const closeList = modals
      .filter(({ id }) => !modalList.includes(id))
      .map(({ id }) => id);
    if (modalList !== prevModalList.current) prevModalList.current = modalList;
    if (closeList.length) setModals(modals.filter(({ id }) => !closeList.includes(id)));
  }, [pathname, query, push, modals]);

  const openHandler = useCallback((
    modal: ReactElement,
    options?: {
      id?: string
      info?: string
    },
  ) => {
    const id = options?.id || v1();
    const modalListString = createModalListString(query, [id]);
    const updatedQueryString = queryString.stringify({
      ...omit(query, [MODAL_QUERY_PARAM_NAME]),
      ...(options?.info ? { [id]: options?.info } : {}),
      ...(modalListString ? { [MODAL_QUERY_PARAM_NAME]: modalListString } : {}),
    });
    const updatedPath = updatedQueryString.length ? [path, updatedQueryString].join('?') : path;
    push(updatedPath).then(() => {
      setModals([...modals, { id, modal }]);
    });
    sessionModalIdStack.current.push(id);
    close();
    return id;
  }, [modals, query, push, path, close]);
  const closeHandler = useCallback((id: string) => {
    if (sessionModalIdStack.current[sessionModalIdStack.current.length - 1] === id) {
      sessionModalIdStack.current.pop();
      return back();
    }
    const modalListString = createModalListString(query, [], [id]);
    const updatedQueryString = queryString.stringify({
      ...omit(query, [id, MODAL_QUERY_PARAM_NAME]),
      ...(modalListString ? { [MODAL_QUERY_PARAM_NAME]: modalListString } : {}),
    });
    const updatedPath = updatedQueryString.length ? [path, updatedQueryString].join('?') : path;
    const historyAction = sessionModalIdStack.current.includes(id) ? replace : push;
    if (historyAction === replace) {
      sessionModalIdStack.current = sessionModalIdStack.current.filter((item) => item !== id);
    }
    close();
    return historyAction(updatedPath).then(() => {
      setModals(modals.filter((item) => item.id !== id));
    });
  }, [modals, query, push, path, back, replace, close]);
  const modalValue = useMemo(() => ({
    open: openHandler, close: closeHandler,
  }), [openHandler, closeHandler]);

  return (
    <ModalContext.Provider value={modalValue}>
      {children}
      {modals.map(({ id, modal }) => cloneElement(modal, { key: id }))}
    </ModalContext.Provider>
  );
};

export default ModalManager;
