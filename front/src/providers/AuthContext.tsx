import React, { FC, useEffect } from 'react'
import { AuthGetUser, useAPIAdvanced } from 'services/api'
import store from 'store'
import { useNotificationContext } from './NotificationContext'

/**
 * Represent the state to secure API
 */
export interface IAPISecurityState {
  apiAccessToken: string
}

interface IAuthState {
  apiAccessToken: string
  username: string
}

interface IAuthContext extends IAuthState {
  setApiAccessToken: (apiAccessToken: string) => void
  logout: () => void
}

/**
 * Export context
 */
export const AuthContext = React.createContext<IAuthContext>({
  apiAccessToken: '',
  username: '',
  setApiAccessToken: (apiAccessToken: string) => {},
  logout: () => {}
})

/**
 * Export helpers
 */
export const useAuthContext = (): IAuthContext => {
  // get the context
  const context = React.useContext(AuthContext)

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useUserContext was used outside of its Provider')
  }

  return context
}

/**
 * Export context provider
 */
export const AuthContextProvider: FC = ({ children }) => {
  const [state, setState] = React.useState<IAuthState>({
    apiAccessToken: store.get('access_token'),
    username: ''
  })

  const authGetUser = useAPIAdvanced(AuthGetUser, state)

  const notificationContext = useNotificationContext()

  const actions = {
    setApiAccessToken: (apiAccessToken: string) => {
      if (apiAccessToken !== '') {
        store.set('access_token', apiAccessToken)
      } else {
        store.clearAll()
      }

      setState({
        ...state,
        apiAccessToken,
        username: ''
      })
    },

    logout: () => {
      setState({
        ...state,
        apiAccessToken: '',
        username: ''
      })
    }

  }

  /**
   * Render
   */
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const { username } = await authGetUser()

      setState({
        ...state,
        username
      })
    }

    console.log(state.apiAccessToken)

    if (state.apiAccessToken !== '') {
      fetchData()
        .catch(err => {
          notificationContext.warning('Authenticate user', err.message)
        })
    }
  }, [state.apiAccessToken])

  return (
    <AuthContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AuthContext.Provider>
  )
}
