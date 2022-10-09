import { EuiGlobalToastList, EuiText } from '@elastic/eui'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ISiteContext, ISiteState, SiteContext } from './context'

const SiteStateProvider = ({children}) => {

  const [ state, setState] = useState<ISiteState>({
    toasts: [],
  })

  console.log("Site provider: refresh")

  const actions = {    
    addSiteToast: (toast: any) => {
      setState({
        ...state,
        toasts: [...state.toasts, {
          id: "t-" + state.toasts.length + 1,
          ...toast
        }]
      })
    },


  }
  
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
    <SiteContext.Provider value={{...state, ...actions}}>
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