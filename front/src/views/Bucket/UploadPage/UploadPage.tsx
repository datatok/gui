import { EuiButton, EuiFieldText, EuiFilePicker, EuiFlexGrid, EuiFlexGroup, EuiFlexItem, EuiForm, EuiFormRow } from '@elastic/eui';
import { useSetSiteMetaTitle } from 'providers/site-meta.context';
import React, { FC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { GuiBrowserObject, GuiBucket } from 'types';

interface UploadPageProps {
  selectedBucket: GuiBucket
  targetKey: string
}

const UploadPage: FC<UploadPageProps> = ({
  selectedBucket,
  targetKey
}) => {

  const setSiteTitle = useSetSiteMetaTitle()

  useEffect(() => {
    setSiteTitle("Upload")
  }, [])

  const [formData, setFormData] = useState({
    bucket: selectedBucket.name,
    host: selectedBucket.host,
    path: targetKey
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

  return (
    <>
      <EuiForm component="form">

        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiFormRow label="Host">
              <EuiFieldText name="host" value={formData.host} onChange={handleInputChange} disabled />
            </EuiFormRow>
            <EuiFormRow label="Bucket">
              <EuiFieldText name="bucket" value={formData.bucket} onChange={handleInputChange} disabled />
            </EuiFormRow>
            <EuiFormRow label="Path" helpText="full path">
              <EuiFieldText name="path" value={formData.path} onChange={handleInputChange} />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow label="File name" helpText="file name">
              <EuiFieldText name="first" onChange={handleInputChange} />
            </EuiFormRow>
            <EuiFormRow>
              <EuiFilePicker
                  multiple
                  initialPromptText="Select or drag and drop multiple files"

                  display={'large'}
                  aria-label="Use aria labels when no actual label is in use"
                />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>

        
        
        
        
        

        

        <EuiButton type="submit" fill>
          Save form
        </EuiButton>

      </EuiForm>
    </>
  );
};

export default UploadPage;