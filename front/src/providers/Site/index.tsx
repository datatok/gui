import { useContext } from 'react'
import { useSnapshot } from 'valtio'
import { actions, state, ISiteContext, SiteContext } from './context'

export { default as SiteProvider } from './provider'

export const useSiteStateSnapshot = ():ISiteContext => {
  return useSnapshot<ISiteContext>(useContext(SiteContext)) as ISiteContext
}

export const setSiteTitle = (t:string) => {
  actions.setTitle(t)
}

export const addSiteToast = (toast: any) => {
  actions.addToast(toast)
}

export const useAuth = () => {
  return {
    apiAccessToken: state.apiAccessToken
  }
}