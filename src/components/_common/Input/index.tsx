import React, { FC, ChangeEvent, ReactNode } from 'react';
import noop from 'lodash.noop';
import cn from 'classnames';
import { v1 } from 'uuid';

import css from './Input.module.scss';

type Props = {
  warning?: string
  error?: string
  success?: string
  id?: string
  className?: string
  name?: string
  label?: string
  placeholder?: string
  value?: string | number
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  prepend?: ReactNode
  append?: ReactNode
  autoComplete?: boolean
  lock?: boolean
  big?: boolean
  spellcheck?: boolean
};

const Input: FC<Props> = (
  {
    id = v1(),
    warning = '',
    error = '',
    success = '',
    label = '',
    className = '',
    name = '',
    placeholder = '',
    value = '',
    onChange = noop,
    prepend = null,
    append = null,
    autoComplete = false,
    lock = false,
    big = false,
    spellcheck = true,
  }: Props,
) => {
  return (
    <div className={cn(css.Input, className)}>
      {label ? (
        <div className={css.label}>
          <label htmlFor={id}>{label}</label>
        </div>
      ) : null}
      <div className={css.container}>
        {prepend ? (
          <div className={css.prepend}>
            {prepend}
          </div>
        ) : null}
        <input
          spellCheck={spellcheck}
          disabled={lock}
          autoComplete={autoComplete ? 'on' : 'off'}
          id={id}
          name={name}
          className={cn(css.input, {
            [css['input--big']]: big,
            [css['input--error']]: error,
          })}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          type="text"
        />
        {append ? (
          <div className={css.append}>
            {append}
          </div>
        ) : null}
      </div>
      {Boolean(success) && !error && !warning && (
        <div className={css.success}>
          {success}
        </div>
      )}
      {!error && Boolean(warning) && (
        <div className={css.warning}>
          {warning}
        </div>
      )}
      {Boolean(error) && (
        <div className={css.error}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;
