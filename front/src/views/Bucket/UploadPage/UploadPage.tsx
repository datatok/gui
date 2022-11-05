import { EuiBasicTable, EuiButton, EuiFieldText, EuiFilePicker, EuiFlexGroup, EuiFlexItem, EuiForm, EuiFormRow, EuiSpacer } from '@elastic/eui'
import { useBrowserContext } from 'providers/BucketBrowserContext'
import { useSetSiteMetaTitle } from 'providers/SiteMetaContext'
import React, { FC, useState, useEffect } from 'react'
import { If, Then } from 'react-if'
import { useAPI } from 'services/api'
import UploadObjectsCommand from 'services/api/commands/UploadObjectsCommand'
import { Route, useRoutingNavigate } from 'services/routing'
import { notifyToastAdd, notifyWarning } from 'stores/NotificationStore'
import { StringUtils } from 'utils/StringUtils'

interface MyState {
  bucket: string
  host: string
  path: string
  files: File[]
}

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
    setSiteTitle('Upload')
  }, [setSiteTitle])

  const navigate = useRoutingNavigate()

  const [formData, setFormData] = useState<MyState>({
    bucket: selectedBucket === null ? '' : selectedBucket.name,
    host: selectedBucket === null ? '' : selectedBucket.host,
    path: targetKey === null ? '' : targetKey,
    files: []
  })

  if (selectedBucket == null) {
    return <></>
  }

  const handleInputChange = (event: any): void => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleFilesChange = (files: FileList): void => {
    setFormData({
      ...formData,
      files: Array.from(files)
    })
  }

  const submitForm = (): void => {
    if (formData.files?.length === 0) {
      notifyToastAdd({
        color: 'warning',
        title: 'Upload',
        text: 'Files are missing!'
      })
    } else {
      uploadObjects(selectedBucket, formData.path, formData.files)
        .then(response => {
          notifyToastAdd({
            color: 'success',
            title: 'Upload',
            text: 'Your files are ready!'
          })
          navigate(Route.BucketBrowse, {
            bucket: selectedBucket.id,
            path: targetKey === null ? '' : targetKey
          })
        })
        .catch(err => {
          notifyWarning('API', err.message)
        })
    }
  }

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
                required
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

        <If condition={formData?.files?.length > 0}>
          <Then>
              <EuiBasicTable<File>
                items={formData.files}
                columns={[
                  { field: 'name', name: 'Name' },
                  { field: 'size', name: 'size', render: (size: number) => StringUtils.formatBytes(size, 2) }
                ]}
              />
          </Then>
        </If>

      </EuiForm>
    </>
  )
}

export default UploadPage
