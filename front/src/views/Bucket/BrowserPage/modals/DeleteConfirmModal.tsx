import { EuiConfirmModal } from '@elastic/eui';
import { useNotificationContext } from 'providers/NotificationContext';
import React, { FC, useState } from 'react';
import { useCallback } from 'react';
import { DeleteObjectCommand, useAPI } from 'services/api';
import { GuiBrowserObject, GuiBucket } from 'types';

interface DeleteConfirmModalProps {
  bucket: GuiBucket
  selectedItems: GuiBrowserObject[]
  onClose: () => void
}

const DeleteConfirmModal: FC<DeleteConfirmModalProps> = ({
  bucket,
  selectedItems,
  onClose
}) => {

  const apiDeleteObject = useAPI(DeleteObjectCommand)

  const { addSiteToast } = useNotificationContext()

  const [processStatus, setProcessStatus] = useState({
    step: '',
    message: ''
  })

  const doDeleteSelection = useCallback(async () => {
    setProcessStatus({ step: 'doing', message: ''})

    try {
      const response = await apiDeleteObject(bucket, selectedItems)
          
      setProcessStatus({ step: 'done', message: ''})
          
      addSiteToast({
        title: 'Success',
        color: 'success',
        iconType: 'help',
        text: "File deleted!",
      })

      onClose()
    }
    catch(err) {
      setProcessStatus({ step: 'error', message: err.message})
    }
  }, [bucket, selectedItems])

  return (<EuiConfirmModal
      title="Do this destructive thing"
      onCancel={onClose}
      onConfirm={doDeleteSelection}
      cancelButtonText="No, don't do it"
      confirmButtonText="Yes, do it"
      buttonColor="danger"
      defaultFocusedButton="confirm"
    >
      <p>You&rsquo;re about to remove {selectedItems.length} file(s):</p>
      <ul>
        {selectedItems.map((file:GuiBrowserObject) => (
          <li key={file.name}>{file.name}</li>
        ))}
      </ul>
      <p>Are you sure you want to do this?</p>
    </EuiConfirmModal>)
}

export default DeleteConfirmModal