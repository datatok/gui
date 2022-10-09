import React, { FC, useState } from 'react';
import {
  EuiPageTemplate
} from '@elastic/eui';
import { useEffect } from 'react';
import { Route, useRoutingNavigate } from 'services/routing';
import { AxiosError } from 'axios';
import APIWorkflowCallout from 'components/APIWorkflowCallout';
import { useAPI, useAuthAnonymousLogin } from 'services/api';
import AuthLoginAnonymousCommand from 'services/api/commands/AuthLoginAnonymousCommand';
import { useAuthContext } from 'providers/auth.context';

const AnonymousLoginPage: FC = () => {

  const navigate = useRoutingNavigate()
  const apiAuthLoginAnonymous = useAPI(AuthLoginAnonymousCommand)
  const { setApiAccessToken } = useAuthContext()
  
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

      apiAuthLoginAnonymous()
        .then(({token}) => {
          setApiAccessToken(token)

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