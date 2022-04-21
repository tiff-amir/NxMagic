import { FC, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';

const ViewportSizeWatcher: FC = () => {
  const root = useMemo(() => document.documentElement, []);
  const resizeHandler = useMemo(() => {
    return debounce(() => {
      const { innerWidth, innerHeight } = window;
      root.style.setProperty('--width', `${innerWidth}px`);
      root.style.setProperty('--height', `${innerHeight}px`);
    }, 150);
  }, [root]);
  resizeHandler();
  useEffect(() => {
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [resizeHandler]);
  return null;
};

export default ViewportSizeWatcher;
