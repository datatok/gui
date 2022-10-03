import React, { FC, useEffect } from 'react';
import {
  EuiCallOut,
  EuiLink,
  EuiLoadingSpinner,
  EuiPageTemplate, EuiText,
} from '@elastic/eui';
import { useRoutingNavigate, Route } from 'services/routing';
import { bucketActions } from 'providers/Bucket'
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useSiteStateSnapshot } from 'providers/Site';
import APIWorkflowCallout from 'components/APIWorkflowCallout';
import { GetBucketsCommand } from 'services/api';

const HomeLayout: FC = () => {

  const navigate = useRoutingNavigate()
  const { apiAccessToken } = useSiteStateSnapshot()
  const [workflowStep, setWorkflowStep] = useState({
    status: "start",
    message: ""
  })

  useEffect(() => {
    if (apiAccessToken === '') {
      navigate(Route.AuthHome);
    } else if (workflowStep.status === "start") {

      setWorkflowStep({
        status: "loading",
        message: ""
      })

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
        })
    }
  })

  const retry = () => {
    setWorkflowStep({
      status: "start",
      message: ""
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