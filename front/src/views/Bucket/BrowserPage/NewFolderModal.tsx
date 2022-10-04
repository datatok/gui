import React, { FC, useState } from 'react';
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
  useGeneratedHtmlId,
} from '@elastic/eui';

import { GuiBrowserFile, GuiBucket } from 'types';

interface NewFolderModalProps {
  bucket: GuiBucket
  selectedItem: GuiBrowserFile
  onConfirm: (data: any) => void
  onCancel: () => void
}

const NewFolderModal: FC<NewFolderModalProps> = ({
  bucket,
  selectedItem,
  onConfirm,
  onCancel
}) => {

  const [formData, setFormData] = useState({
    bucket: bucket.name,
    path: selectedItem?.path,
    name: ""
  })

  const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });
  const modalFormSwitchId = useGeneratedHtmlId({ prefix: 'modalFormSwitch' });

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  const formSample = (
    <EuiForm id={modalFormId} component="form" onSubmit={() => onConfirm(formData)}>

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
  );

  return (
    <EuiModal
      title="Do this destructive thing"
      onClose={onCancel}
    >
     <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h1>New folder</h1>
        </EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>{formSample}</EuiModalBody>

      <EuiModalFooter>
        <EuiButtonEmpty onClick={onCancel}>Cancel</EuiButtonEmpty>

        <EuiButton type="submit" fill onClick={() => onConfirm(formData)}>
          Save
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  )
}

export default NewFolderModal