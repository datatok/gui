import React, { FC, useState } from 'react';
import {
  EuiPageTemplate
} from '@elastic/eui';
import { useEffect } from 'react';
import { Route, useRoutingNavigate } from 'services/routing';
import { AxiosError } from 'axios';
import APIWorkflowCallout from 'components/APIWorkflowCallout';
import AuthLoginAnonymousCommand from 'services/api/commands/AuthLoginAnonymousCommand';

interface Props {
  setApiAccessToken: (apiAccessToken: string) => void
}

const AnonymousLoginPage: FC<Props> = ({setApiAccessToken}) => {

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

      AuthLoginAnonymousCommand()
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