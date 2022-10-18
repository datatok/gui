import React, { FC, useEffect, useState } from 'react'
import {
  EuiPageTemplate
} from '@elastic/eui'
import { useRoutingNavigate, Route } from 'services/routing'
import APIWorkflowCallout from 'components/APIWorkflowCallout'

interface Props {
  apiAccessToken: string
}

const HomeLayout: FC<Props> = ({ apiAccessToken }) => {
  const navigate = useRoutingNavigate()
  const [workflowStep, setWorkflowStep] = useState({
    status: 'start',
    message: ''
  })

  useEffect(() => {
    if (apiAccessToken === '') {
      navigate(Route.AuthHome)
    } else if (workflowStep.status === 'start') {
      setWorkflowStep({
        status: 'loading',
        message: ''
      })
    }
  })

  const retry = (): void => {
    setWorkflowStep({
      status: 'start',
      message: ''
    })
  }

  return (
    <EuiPageTemplate minHeight="0" panelled={true} restrictWidth={'75%'}>
      <EuiPageTemplate.Header pageTitle="Welcome to GUI">
      </EuiPageTemplate.Header>
      <EuiPageTemplate.EmptyPrompt
        title={<h2>Getting buckets information</h2>}
        color="plain"
        layout="horizontal"
        body={
          <APIWorkflowCallout
            status={workflowStep.status}
            message={workflowStep.message}
            onRetry={retry}
          />
        }
      />
    </EuiPageTemplate>
  )
}

export default HomeLayout
