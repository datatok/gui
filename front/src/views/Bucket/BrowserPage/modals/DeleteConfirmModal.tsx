import { EuiConfirmModal } from '@elastic/eui'
import React, { FC, useState } from 'react'
import { DeleteObjectCommand, useAPI } from 'services/api'
import { notifyToastAdd } from 'stores/NotificationStore'
import { GuiBrowserObject, GuiBucket } from 'types'

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

  const [processStatus, setProcessStatus] = useState({
    step: '',
    message: ''
  })

  const doDeleteSelection = (): void => {
    setProcessStatus({ step: 'doing', message: '' })

    apiDeleteObject(bucket, selectedItems)
      .then(() => {
        setProcessStatus({ step: 'done', message: '' })

        notifyToastAdd({
          title: 'Success',
          color: 'success',
          iconType: 'help',
          text: 'File deleted!'
        })

        onClose()
      })
      .catch(err => {
        setProcessStatus({ step: 'error', message: err.message })
      })
  }

  return (<EuiConfirmModal
      title="Do this destructive thing"
      onCancel={onClose}
      onConfirm={doDeleteSelection}
      cancelButtonText="No, don't do it"
      confirmButtonText="Yes, do it"
      buttonColor="danger"
      defaultFocusedButton="confirm"
      isLoading={processStatus.step === 'doing'}
    >
      <p>You&rsquo;re about to remove {selectedItems.length} file(s):</p>
      <ul>
        {selectedItems.map((file: GuiBrowserObject) => (
          <li key={file.name}>{file.name}</li>
        ))}
      </ul>
      <p>Are you sure you want to do this?</p>
    </EuiConfirmModal>)
}

export default DeleteConfirmModal
