import React, { FC, useState } from 'react'
import {
  EuiButton,
  EuiButtonEmpty,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  useGeneratedHtmlId
} from '@elastic/eui'

import { GuiBrowserObject, GuiBucket } from 'types'
import MoveObjectCommand from 'services/api/commands/MoveObjectCommand'
import { useAPI } from 'services/api'
import { notifyWarning } from 'stores/NotificationStore'

interface RenameModalProps {
  selectedItem: GuiBrowserObject
  bucket: GuiBucket
  onClose: () => void
}

const RenameModal: FC<RenameModalProps> = ({
  bucket,
  selectedItem,
  onClose
}) => {
  const apiRenameKey = useAPI(MoveObjectCommand)

  const [formData, setFormData] = useState({
    name: selectedItem.name,
    prefix: selectedItem.prefix
  })

  const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' })

  const onFormNameChange = (event: any): void => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const onSubmit = (): void => {
    apiRenameKey(bucket, selectedItem, `${formData.prefix}/${formData.name}`)
      .then(response => {
        onClose()
      })
      .catch(err => {
        notifyWarning('API', err.message)
      })
  }

  const formSample = (
    <EuiForm id={modalFormId} component="form">

      <EuiFormRow label="New prefix" helpText={`(${selectedItem.prefix})`}>
        <EuiFieldText name="prefix" value={formData.prefix} onChange={onFormNameChange} />
      </EuiFormRow>

      <EuiFormRow label="New name" helpText={`(${selectedItem.name})`}>
        <EuiFieldText name="name" value={formData.name} onChange={onFormNameChange} />
      </EuiFormRow>

    </EuiForm>
  )

  return (
    <EuiModal
      title="Do this destructive thing"
      onClose={onClose}
    >
     <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h1>Edit file {selectedItem.name}</h1>
        </EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>{formSample}</EuiModalBody>

      <EuiModalFooter>
        <EuiButtonEmpty onClick={onClose}>Cancel</EuiButtonEmpty>

        <EuiButton type="submit" onClick={onSubmit} fill>
          Save
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  )
}

export default RenameModal
