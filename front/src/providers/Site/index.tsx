import { EuiGlobalToastList, EuiText } from '@elastic/eui'
import { useContext, useState } from 'react'
import { ISiteContext, SiteContext } from './context'

const SiteStateProvider = ({children}) => {

  const [ state, setState] = useState<ISiteContext>({
    title: "GUI",
    apiAccessToken: localStorage.getItem('apiAccessToken'),
    toasts: [],
    
    setTitle: (title: string) => {
      if (title !== state.title) {
        setState({
          ...state,
          title
        })
      }
    },
    
    addSiteToast: (toast: any) => {
      setState({
        ...state,
        toasts: [...state.toasts, {
          id: "t-" + state.toasts.length + 1,
          ...toast
        }]
      })
    },

    setApiAccessToken: (apiAccessToken: string) => {
      setState({
        ...state,
        apiAccessToken
      })
  
      localStorage.setItem('apiAccessToken', apiAccessToken)
    },
  })
  
  const copyToats = state.toasts.map(t => {
    return {
      ...t,
      text: <EuiText><p>{t.text}</p></EuiText>
    }
  })

  const removeToast = (removedToast) => {
    setState({
      ...state,
      toasts: state.toasts.filter((toast) => toast.id !== removedToast.id)
    })
  }

  return (
    <SiteContext.Provider value={state}>
        {children}
        <EuiGlobalToastList
          toasts={copyToats}
          dismissToast={removeToast}
          toastLifeTimeMs={6000}
        />
    </SiteContext.Provider>
  )
}

export default SiteStateProvider