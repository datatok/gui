import React, { FC, useEffect, useState } from 'react'
import {
  EuiPageTemplate,
  EuiListGroup,
  EuiListGroupItemProps,
  EuiIcon
} from '@elastic/eui'

import logoSVG from '../../../../logo.svg'
import { AuthLoginMethodsCommand, usePublicAPI } from 'services/api'
import { useNavigate } from 'react-router-dom'
import { AuthMethod } from 'services/api/commands/AuthLoginMethodsCommand'
import { useNotificationContext } from 'providers/NotificationContext'

const AUTH_PROVIDERS = {
  gitlab: {
    href: '/auth/gitlab',
    iconType: 'link'
  },
  anonymous: {
    label: 'Anonymous',
    href: '/auth/anonymous',
    iconType: 'glasses'
  }
}

const LoginPage: FC = () => {
  const [authMethods, setAuthMethods] = useState<AuthMethod[]>([])

  const getAuthMethods = usePublicAPI(AuthLoginMethodsCommand)

  const notificationContext = useNotificationContext()

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const methods = await getAuthMethods()

      setAuthMethods(methods)
    }

    fetchData()
      .catch(err => {
        notificationContext.warning('Login', err.message)
      })
  }, [setAuthMethods])

  const authLinks: EuiListGroupItemProps[] = authMethods.map(
    (method): EuiListGroupItemProps => {
      const dd = AUTH_PROVIDERS[method.provider]

      return {
        ...dd,
        ...method,
        onClick: (e) => {
          e.preventDefault()
          e.stopPropagation()

          navigate(dd.href)
        }
      }
    }
  )

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <EuiIcon type={logoSVG} size="xxl" />
      </div>
      <EuiPageTemplate.EmptyPrompt
        title={<h2>Login to GUI</h2>}
        color="plain"
        layout="horizontal"
        body={
          <>
            <p>
              Please select an authentication method:
            </p>
          </>
        }
        actions={
          <EuiListGroup listItems={authLinks} />
        }
      />
    </>
  )
}

export default LoginPage
