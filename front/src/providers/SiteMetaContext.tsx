import React from "react";

type BreadcrumbItem = {
  text: string
  href?: string
}

interface ISiteMetaState {
  title: string
  breadcrumbs: BreadcrumbItem[]
}

interface ISiteMetaContext extends ISiteMetaState {
  setTitle: (title: string) => void
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
}

/**
 * Export context
 */
export const SiteContext = React.createContext<ISiteMetaContext>({
  title: '',
  breadcrumbs: [],
  setTitle: (title: string) => {},
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => {}
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
    title: "GUI",
    breadcrumbs: []
  })

  const actions = {

    setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => {
      setState({
        ...state,
        breadcrumbs
      })
    },

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
