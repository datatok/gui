import { EuiBasicTable, EuiButton, EuiFieldText, EuiFilePicker, EuiFlexGrid, EuiFlexGroup, EuiFlexItem, EuiForm, EuiFormRow, EuiSpacer, EuiTable } from '@elastic/eui';
import { useBrowserContext } from 'providers/Browser';
import { useSetSiteMetaTitle } from 'providers/site-meta.context';
import React, { FC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAPI } from 'services/api';
import UploadObjectsCommand from 'services/api/commands/UploadObjectsCommand';
import { StringUtils } from 'utils/StringUtils';

const UploadPage: FC = () => {

  /**
   * Contexts
   */
  const setSiteTitle = useSetSiteMetaTitle()
  const uploadObjects = useAPI(UploadObjectsCommand)

  const {
    currentKey: targetKey,
    bucket: selectedBucket
  } = useBrowserContext()

  useEffect(() => {
    setSiteTitle("Upload")
  }, [])

  const [formData, setFormData] = useState({
    bucket: selectedBucket.name,
    host: selectedBucket.host,
    path: targetKey,
    files: []
  })

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    

    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleFilesChange = (files:FileList) => {
    setFormData({
      ...formData,
      files: Array.from(files)
    });
  }

  const submitForm = async () =>{
  
    const res = await uploadObjects(selectedBucket, formData.path, formData.files)

    console.log(res)
  }

  console.log(formData)

  return (
    <>
      <EuiForm component="form" onSubmit={submitForm}>

        <EuiFlexGroup alignItems={'flexStart'}>
          <EuiFlexItem>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiFormRow label="Host">
                  <EuiFieldText name="host" value={formData.host} onChange={handleInputChange} disabled />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow label="Bucket">
                  <EuiFieldText name="bucket" value={formData.bucket} onChange={handleInputChange} disabled />
                </EuiFormRow>
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiFormRow label="Path" helpText="full path" fullWidth>
              <EuiFieldText name="path" fullWidth value={formData.path} onChange={handleInputChange} />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow fullWidth>
              <EuiFilePicker
                name="files"
                onChange={handleFilesChange}
                multiple
                fullWidth
                initialPromptText="Select or drag and drop multiple files"
                display={'large'}
                aria-label="Use aria labels when no actual label is in use"
              />
            </EuiFormRow>

            <EuiSpacer />

            <EuiButton onClick={submitForm} fill fullWidth>
              Save form
            </EuiButton>

          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer />
        <EuiBasicTable
          items={formData.files}
          columns={[
            {field: 'name', name: 'Name'},
            {field: 'size', name: 'size', render: (size) => StringUtils.formatBytes(size, 2)}
          ]}
        />

      </EuiForm>
    </>
  );
};

export default UploadPage;