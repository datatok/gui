import React from "react";

interface IAuthState {
  apiAccessToken: string
}

interface IAuthContext extends IAuthState {
  setApiAccessToken: (apiAccessToken: string) => void
  logout: () => void
}

/**
 * Export context
 */
export const AuthContext = React.createContext<IAuthContext>({
  apiAccessToken: localStorage.getItem('apiAccessToken'),
  setApiAccessToken: (apiAccessToken: string) => {},
  logout: () => {}
});

/**
 * Export helpers
 */
export const useAuthContext = () => {
  // get the context
  const context = React.useContext(AuthContext);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error("useUserContext was used outside of its Provider");
  }

  return context;
}

/**
 * Export context provider
 */
export const AuthContextProvider = ({children}) => {

  const [ state, setState] = React.useState<IAuthState>({
    apiAccessToken: localStorage.getItem('apiAccessToken')
  })

  const actions = {
    setApiAccessToken: (apiAccessToken: string) => {
      setState({
        ...state,
        apiAccessToken
      })
    },

    logout: () => {
      setState({
        ...state,
        apiAccessToken: ''
      })
    }
  }

  React.useEffect(() => {
    localStorage.setItem('apiAccessToken', state.apiAccessToken)
  }, [state.apiAccessToken])

  return (
    <AuthContext.Provider value={{...state, ...actions}}>
      {children}
    </AuthContext.Provider>
  )
}
