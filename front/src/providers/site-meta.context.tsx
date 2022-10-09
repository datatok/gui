import React from "react";

interface ISiteMetaState {
  title: string
}

interface ISiteMetaContext extends ISiteMetaState {
  setTitle: (title: string) => void
}

/**
 * Export context
 */
export const SiteContext = React.createContext<ISiteMetaContext>({
  title: '',
  setTitle: (title: string) => {},
});

/**
 * Export helpers
 */
export const useSiteMetaContext = () => {
  // get the context
  const context = React.useContext(SiteContext);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error("useUserContext was used outside of its Provider");
  }

  return context;
}

export const useSetSiteMetaTitle = () => {
  const ctx = React.useContext(SiteContext)
  
  return (title: string) => {
    ctx.setTitle(title)
  }
}

/**
 * Export context provider
 */
export const SiteMetaContextProvider = ({children}) => {

  const [ state, setState] = React.useState<ISiteMetaState>({
    title: "GUI"
  })

  const actions = {
    setTitle: (title: string) => {
     if (title !== state.title) {
        setState({
          ...state,
          title
        })
      }
    }
  }

  return (
    <SiteContext.Provider value={{...state, ...actions}}>
      {children}
    </SiteContext.Provider>
  )
}
