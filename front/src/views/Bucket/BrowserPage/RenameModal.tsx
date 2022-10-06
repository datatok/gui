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
  EuiRange,
  EuiSwitch,
  EuiSuperSelect,
  EuiText,
  useGeneratedHtmlId,
} from '@elastic/eui';

import { GuiBrowserObject } from 'types';

interface RenameModalProps {
  selectedItem: GuiBrowserObject
  onConfirm: () => void
  onCancel: () => void
}

const RenameModal: FC<RenameModalProps> = ({
  selectedItem,
  onConfirm,
  onCancel
}) => {

  const [editedItemName, setEditedItemName] = useState(selectedItem.name);

  const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });
  const modalFormSwitchId = useGeneratedHtmlId({ prefix: 'modalFormSwitch' });

  const onFormNameChange = (e) => {
    setEditedItemName(e.target.value)
  }

  const formSample = (
    <EuiForm id={modalFormId} component="form">

      <EuiFormRow label="Name">
        <EuiFieldText name="popfirst" value={editedItemName} onChange={onFormNameChange} />
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
          <h1>Edit file "{selectedItem.name}"</h1>
        </EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>{formSample}</EuiModalBody>

      <EuiModalFooter>
        <EuiButtonEmpty onClick={onCancel}>Cancel</EuiButtonEmpty>

        <EuiButton type="submit" fill>
          Save
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  )
}

export default RenameModal