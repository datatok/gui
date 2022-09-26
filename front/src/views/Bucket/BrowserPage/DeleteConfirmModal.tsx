import { EuiConfirmModal } from '@elastic/eui';
import React, { FC } from 'react';
import { GuiBrowserFile } from 'types';

interface DeleteConfirmModalProps {
  selectedItems: GuiBrowserFile[]
  onConfirm: () => void
  onCancel: () => void
}

const DeleteConfirmModal: FC<DeleteConfirmModalProps> = ({
  selectedItems,
  onConfirm,
  onCancel
}) => {

  return (<EuiConfirmModal
      title="Do this destructive thing"
      onCancel={onCancel}
      onConfirm={onConfirm}
      cancelButtonText="No, don't do it"
      confirmButtonText="Yes, do it"
      buttonColor="danger"
      defaultFocusedButton="confirm"
    >
      <p>You&rsquo;re about to remove {selectedItems.length} file(s):</p>
      <ul>
        {selectedItems.map((file:GuiBrowserFile) => (
          <li key={file.name}>{file.name}</li>
        ))}
      </ul>
      <p>Are you sure you want to do this?</p>
    </EuiConfirmModal>)

}

export default DeleteConfirmModal