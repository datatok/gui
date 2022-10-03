import React, { FC, useState } from 'react';
import {
  EuiPageTemplate
} from '@elastic/eui';
import { useEffect } from 'react';
import { Route, useRoutingNavigate } from 'services/routing';
import { AxiosError } from 'axios';
import APIWorkflowCallout from 'components/APIWorkflowCallout';
import { actions as siteActions } from 'providers/Site/context'
import { AuthLoginCommand } from 'services/api';

const AnonymousLoginPage: FC = () => {

  const navigate = useRoutingNavigate()
  const [workflowStep, setWorkflowStep] = useState({
    status: "start",
    message: ""
  })

  useEffect(() => {
    if (workflowStep.status === "start") {

      setWorkflowStep({
        status: "loading",
        message: ""
      })

      AuthLoginCommand()
        .then(({token}) => {
          siteActions.setAPIAccessToken(token)

          navigate(Route.Home);
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
    <EuiPageTemplate.EmptyPrompt
      title={<h2>Login as anonymous</h2>}
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
    )

}

export default AnonymousLoginPage