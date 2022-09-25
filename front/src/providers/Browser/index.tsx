import { useContext } from 'react'
import { useSnapshot } from 'valtio'
import { actions, state, IBrowserContext, BrowserContext } from './context'

export { default as BrowserStateProvider } from './provider'

export { actions as browserStateActions } from './context'

export const useBrowserStateSnapshot = ():IBrowserContext => {
  return useSnapshot<IBrowserContext>(useContext(BrowserContext)) as IBrowserContext
}