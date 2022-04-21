import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import cn from 'classnames';

import css from './VirtualizedList.module.scss';

type Props = {
  overScanCount?: number
  itemCount: number
  rowRender: (options: { index: number, style: { [key: string]: string } }) => ReactNode
  className?: string
};

const VirtualizedList: FC<Props> = (
  { className, rowRender, itemCount, overScanCount = 5 }: Props,
) => {
  const [size, setSize] = useState(0);
  const root = useRef<HTMLDivElement>();
  const testItem = useRef<HTMLDivElement>();

  useEffect(() => {
    if (root.current && testItem.current?.offsetHeight) {
      setSize(testItem.current?.offsetHeight);
    }
  }, []);

  return (
    <div ref={root} className={cn(css.VirtualizedList, className)}>
      {size ? (
        <List
          overscanCount={overScanCount}
          height={root.current.offsetHeight}
          width={root.current.offsetWidth}
          itemCount={itemCount}
          itemSize={size}
        >
          {rowRender}
        </List>
      ) : (
        <div ref={testItem} className={css.testItem}>
          {rowRender({ index: 0, style: {} })}
        </div>
      )}
    </div>
  );
};

export default VirtualizedList;
