import React, { FC, ReactNode } from 'react';

import Button, { OUTLINE_TYPE, DANGER_STYLE, REGULAR_STYLE, CONTAINED_TYPE } from '@common/TextButton';
import useTranslation from '@hooks/useTranslation';
import BaseModal from '../BaseModal';

type Props = {
  danger?: boolean
  title?: string
  text?: string
  children?: ReactNode
  submitText?: string
  cancelText?: string
  onCancel: () => void
  onSubmit: () => void
};

const ConfirmationModal: FC<Props> = (
  { text, title, children, submitText, cancelText, onCancel, onSubmit, danger }: Props,
) => {
  const { t } = useTranslation();
  return (
    <BaseModal
      onClose={onCancel}
      onSubmit={onSubmit}
      title={title}
      buttons={(
        <>
          <Button type={OUTLINE_TYPE} onClick={onCancel} text={cancelText || t('_common.cancel')} />
          <Button
            type={danger ? OUTLINE_TYPE : CONTAINED_TYPE}
            style={danger ? DANGER_STYLE : REGULAR_STYLE}
            onClick={onSubmit}
            text={submitText || t('_common.ok')}
          />
        </>
      )}
    >
      {text ? (
        <div>
          {text}
        </div>
      ) : null}
      {children}
    </BaseModal>
  );
};

export default ConfirmationModal;
