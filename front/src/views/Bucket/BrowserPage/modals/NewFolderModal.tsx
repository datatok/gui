import React, { FC, useCallback, useState } from 'react'
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
import { CreateFolderCommand, useAPI } from 'services/api'
import { StringUtils } from 'utils/StringUtils'

interface NewFolderModalProps {
  bucket: GuiBucket
  targetKey: string
  onClose: () => void
}

const NewFolderModal: FC<NewFolderModalProps> = ({
  bucket,
  targetKey,
  onClose
}) => {
  const apiCreateFolder = useAPI(CreateFolderCommand)

  const [processStatus, setProcessStatus] = useState({
    step: '',
    message: ''
  })

  const [formData, setFormData] = useState({
    bucket: bucket.name,
    path: targetKey,
    name: ''
  })

  const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' })
  const modalFormSwitchId = useGeneratedHtmlId({ prefix: 'modalFormSwitch' })

  const handleInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const doCreateFolder = useCallback(async () => {
    setProcessStatus({ step: 'doing', message: '' })

    const response = await apiCreateFolder(bucket, StringUtils.pathJoin(formData.path, formData.name))

    setProcessStatus({ step: 'success', message: '' })

    onClose()
  }, [formData])

  const formSample = (
    <EuiForm id={modalFormId} component="form" onSubmit={doCreateFolder}>

      <EuiFormRow label="Bucket">
        <EuiFieldText name="bucket" value={formData.bucket} onChange={handleInputChange} />
      </EuiFormRow>

      <EuiFormRow label="Path">
        <EuiFieldText name="path" value={formData.path} onChange={handleInputChange} />
      </EuiFormRow>

      <EuiFormRow label="Name">
        <EuiFieldText name="name" value={formData.name} onChange={handleInputChange} />
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
          <h1>New folder</h1>
        </EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>{formSample}</EuiModalBody>

      <EuiModalFooter>
        <EuiButtonEmpty onClick={onClose}>Cancel</EuiButtonEmpty>

        <EuiButton type="submit" fill
          onClick={doCreateFolder}
          isLoading={processStatus.step === 'doing'}>
          Save
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  )
}

export default NewFolderModal
