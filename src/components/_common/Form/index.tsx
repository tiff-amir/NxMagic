import React, { FC, ReactNode, useCallback } from 'react';
import cn from 'classnames';

import { preventDefault } from '@utils/events';

import css from './Form.module.scss';

type Props = {
  className?: string
  autoComplete?: string
  children: ReactNode
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  skipPrevent?: boolean
  disabled?: boolean
};

const Form: FC<Props> = (
  { children, onSubmit, autoComplete = '', className = '', skipPrevent = false, disabled = false }: Props,
) => {
  const submitHandler = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    if (!skipPrevent) preventDefault(e);
    if (!disabled) onSubmit(e);
  }, [disabled, onSubmit, skipPrevent]);
  return (
    <form
      action=""
      autoComplete={autoComplete}
      className={cn(css.Form, className)}
      onSubmit={onSubmit && submitHandler}
    >
      {children}
      {onSubmit && (
        <input type="submit" className={css.hiddenSubmit} />
      )}
    </form>
  );
};

export default Form;
