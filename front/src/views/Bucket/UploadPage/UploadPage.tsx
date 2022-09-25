import { EuiButton, EuiFieldText, EuiFilePicker, EuiFlexGrid, EuiFlexGroup, EuiFlexItem, EuiForm, EuiFormRow } from '@elastic/eui';
import React, { FC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { setSiteTitle } from 'providers/Site';
import { useBrowserStateSnapshot } from 'providers/Browser';

const UploadPage: FC = () => {

  const { 
    bucket: browserBucket,
    current: browserSelectedFile
  } = useBrowserStateSnapshot()

  useEffect(() => {
    setSiteTitle("Upload")
  })

  const [formData, setFormData] = useState({
    bucket: browserBucket.name,
    host: browserBucket.host,
    path: browserSelectedFile?.path
  })

  return (
    <>
      <EuiForm component="form">

        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiFormRow label="Host">
              <EuiFieldText name="host" value={formData.host} disabled />
            </EuiFormRow>
            <EuiFormRow label="Bucket">
              <EuiFieldText name="bucket" value={formData.bucket} disabled />
            </EuiFormRow>
            <EuiFormRow label="Path" helpText="full path">
              <EuiFieldText name="path" value={formData.path} />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow label="File name" helpText="file name">
              <EuiFieldText name="first" />
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