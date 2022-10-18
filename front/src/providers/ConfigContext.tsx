import React, { FC } from 'react'

interface IConfigState {
  apiBaseURL: string
}

interface IConfigContext extends IConfigState {

}

/**
 * Export context
 */
export const ConfigContext = React.createContext<IConfigContext>({
  apiBaseURL: ''
})

/**
 * Export helpers
 */
export const useConfigContext = (): IConfigContext => {
  // get the context
  const context = React.useContext(ConfigContext)

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useConfigContext was used outside of its Provider')
  }

  return context
}

/**
 * Export context provider
 */
export const ConfigContextProvider: FC = ({ children }) => {
  const [state] = React.useState<IConfigState>({
    apiBaseURL: '/api'
  })

  const actions = {

  }

  return (
    <ConfigContext.Provider value={{ ...state, ...actions }}>
      {children}
    </ConfigContext.Provider>
  )
}
