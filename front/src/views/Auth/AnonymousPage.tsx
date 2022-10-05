import React, { FC, useContext, useState } from 'react';
import {
  EuiPageTemplate
} from '@elastic/eui';
import { useEffect } from 'react';
import { Route, useRoutingNavigate } from 'services/routing';
import { AxiosError } from 'axios';
import APIWorkflowCallout from 'components/APIWorkflowCallout';
import { AuthLoginCommand } from 'services/api';
import { SiteContext } from 'providers/Site/context';

const AnonymousLoginPage: FC = () => {

  const navigate = useRoutingNavigate()
  const context = useContext(SiteContext)
  
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
          context.setApiAccessToken(token)

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