import React, { useEffect } from 'react'
import { AuthGetUser, useAPI } from 'services/api'
import store from 'store'

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
export const useAuthContext = () => {
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
export const AuthContextProvider = ({ children }) => {
  const [state, setState] = React.useState<IAuthState>({
    apiAccessToken: store.get('access_token'),
    username: ''
  })

  const authGetUser = useAPI(AuthGetUser, state)

  const actions = {
    setApiAccessToken: (apiAccessToken: string) => {
      if (apiAccessToken) {
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
    const fetchData = async () => {
      const { username } = await authGetUser()

      setState({
        ...state,
        username
      })
    }

    if (state.apiAccessToken) {
      fetchData()
    }
  }, [state.apiAccessToken])

  return (
    <AuthContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AuthContext.Provider>
  )
}
