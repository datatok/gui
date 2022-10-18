import React, { ChangeEvent, FC, useState } from 'react'
import {
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
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
import { useAPI } from 'services/api'
import CopyObjectCommand from 'services/api/commands/CopyObjectCommand'
import { If, Then } from 'react-if'

interface CopyModalProps {
  selectedItem: GuiBrowserObject
  bucket: GuiBucket
  onClose: () => void
}

const CopyModal: FC<CopyModalProps> = ({
  bucket,
  selectedItem,
  onClose
}) => {
  const apiRenameKey = useAPI(CopyObjectCommand)

  const [formData, setFormData] = useState({
    name: selectedItem.name,
    path: selectedItem.prefix
  })

  const [apiStatus, setAPIStatus] = useState({
    step: '',
    message: ''
  })

  const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' })

  const onFormNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const onSubmit = (): void => {
    setAPIStatus({
      step: 'loading',
      message: ''
    })

    apiRenameKey(bucket, selectedItem, `${formData.path}/${formData.name}`)
      .then(() => {
        setAPIStatus({
          step: 'success',
          message: ''
        })

        onClose()
      })
      .catch(err => {
        setAPIStatus({
          step: 'error',
          message: err.message
        })
      })
  }

  const formSample = (
    <EuiForm id={modalFormId} component="form">

      <EuiFormRow label="New path" helpText={`(${selectedItem.path})`}>
        <EuiFieldText name="path" value={formData.path} onChange={onFormNameChange} />
      </EuiFormRow>

      <EuiFormRow label="New name" helpText={`(${selectedItem.name})`}>
        <EuiFieldText name="name" value={formData.name} onChange={onFormNameChange} />
      </EuiFormRow>

    </EuiForm>
  )

  return (
    <EuiModal
      title="Copy"
      onClose={onClose}
    >
     <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h1>Copy `{selectedItem.name}`</h1>
        </EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>
        {formSample}
        <If condition={apiStatus.step === 'error'}>
          <Then>
            <EuiCallOut color='danger'>{apiStatus.message}</EuiCallOut>
          </Then>
        </If>
      </EuiModalBody>

      <EuiModalFooter>
        <EuiButtonEmpty onClick={onClose}>Cancel</EuiButtonEmpty>

        <EuiButton type="submit" onClick={onSubmit} fill isLoading={apiStatus.step === 'loading'}>
          Save
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  )
}

export default CopyModal
