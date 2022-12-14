import React, { FC, useState, useEffect } from 'react'
import {
  EuiPageTemplate
} from '@elastic/eui'
import { Route, useRoutingNavigate } from 'services/routing'
import { AxiosError } from 'axios'
import APIWorkflowCallout from 'components/APIWorkflowCallout'
import { useAPI } from 'services/api'
import AuthLoginAnonymousCommand from 'services/api/commands/AuthLoginAnonymousCommand'
import { useAuthContext } from 'providers/AuthContext'

const AnonymousLoginPage: FC = () => {
  const navigate = useRoutingNavigate()
  const apiAuthLoginAnonymous = useAPI(AuthLoginAnonymousCommand)
  const { setApiAccessToken } = useAuthContext()

  const [workflowStep, setWorkflowStep] = useState({
    status: 'start',
    message: ''
  })

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setWorkflowStep({
        status: 'loading',
        message: ''
      })

      const { token } = await apiAuthLoginAnonymous()

      setApiAccessToken(token)

      navigate(Route.Home)
    }

    fetchData()
      .catch((error: AxiosError) => {
        setWorkflowStep({
          status: 'error',
          message: error.message
        })
      })
  }, [])

  const retry = (): void => {
    setWorkflowStep({
      status: 'start',
      message: ''
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
