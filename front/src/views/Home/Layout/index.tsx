import React, { FC, useEffect, useState } from 'react'
import {
  EuiCallOut,
  EuiLink,
  EuiLoadingSpinner,
  EuiPageTemplate, EuiText
} from '@elastic/eui'
import { useRoutingNavigate, Route } from 'services/routing'
import { AxiosError } from 'axios'
import APIWorkflowCallout from 'components/APIWorkflowCallout'
import { GetBucketsCommand } from 'services/api'

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
      /*
      GetBucketsCommand()
        .then(({ buckets }) => {
          bucketActions.setBuckets(buckets)

          navigate(Route.BucketHome, { bucket : buckets[0].id});
        })
        .catch((error:AxiosError) => {
          setWorkflowStep({
            status: "error",
            message: error.message
          })
        }) */
    }
  })

  const retry = () => {
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
