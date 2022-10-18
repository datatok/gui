import { EuiCallOut, EuiLink, EuiLoadingSpinner, EuiText } from '@elastic/eui'
import React, { FC } from 'react'

interface SidebarProps {
  status: string
  message: string
  onRetry: () => void
}

const APIWorkflowCallout: FC<SidebarProps> = ({ message, onRetry, status }) => {
  return (
    <EuiText textAlign='center'>
      {status === 'loading'
        ? (
          <EuiLoadingSpinner size='xxl' />
          )
        : ''}

      {status === 'error'
        ? (
          <EuiCallOut title="Sorry, there was an error" color="danger" iconType="alert">
          <p>
          API client is getting:
          </p>
          <p>
          {message}
          </p>
          <p>
          <EuiLink onClick={onRetry}>retry</EuiLink>
          </p>
      </EuiCallOut>
          )
        : ''}
      </EuiText>
  )
}

export default APIWorkflowCallout
