import React, { FC } from 'react'
import store from 'store'

const LightTheme = React.lazy(async () => await import('../themes/Light'))
const DarkTheme = React.lazy(async () => await import('../themes/Dark'))
const themes = ['light', 'dark']

const themeFromStore = store.get('theme')
const themeDefault = themes.includes(themeFromStore) ? themeFromStore : themes[0]

interface BreadcrumbItem {
  text: string
  href?: string
}

interface ISiteMetaState {
  title: string
  breadcrumbs: BreadcrumbItem[]
  theme: string
}

interface ISiteMetaContext extends ISiteMetaState {
  setTitle: (title: string) => void
  setTheme: (theme: string) => void
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
}

/**
 * Export context
 */
export const SiteContext = React.createContext<ISiteMetaContext>({
  title: '',
  breadcrumbs: [],
  theme: themeDefault,
  setTitle: (title: string) => {},
  setTheme: (theme: string) => {},
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => {}
})

/**
 * Export helpers
 */
export const useSiteMetaContext = (): ISiteMetaContext => {
  // get the context
  const context = React.useContext(SiteContext)

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useUserContext was used outside of its Provider')
  }

  return context
}

export const useSetSiteMetaTitle = (): (title: string) => void => {
  const ctx = React.useContext(SiteContext)

  return (title: string) => {
    ctx.setTitle(title)
  }
}

/**
 * Export context provider
 */
export const SiteMetaContextProvider: FC = ({ children }) => {
  const [state, setState] = React.useState<ISiteMetaState>({
    title: 'GUI',
    breadcrumbs: [],
    theme: themeDefault
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
    },

    setTheme: (theme: string) => {
      if (theme !== state.theme) {
        store.set('theme', theme)

        setState({
          ...state,
          theme
        })
      }
    }
  }

  return (
    <SiteContext.Provider value={{ ...state, ...actions }}>
      <React.Suspense fallback={<></>}>
        {(state.theme === 'light') && <LightTheme />}
        {(state.theme === 'dark') && <DarkTheme />}
      </React.Suspense>
      {children}
    </SiteContext.Provider>
  )
}
