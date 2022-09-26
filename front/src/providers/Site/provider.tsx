import { EuiGlobalToastList, EuiText } from "@elastic/eui"
import { useSiteStateSnapshot } from "."
import { actions, SiteContext, state } from "./context"

const SiteStateProvider = ({children}) => {
  
  const { toasts } = useSiteStateSnapshot()
  
  const copyToats = toasts.map(t => {
    return {
      ...t,
      text: <EuiText><p>{t.text}</p></EuiText>
    }
  })

  return (
    <SiteContext.Provider value={state}>
        {children}
        <EuiGlobalToastList
          toasts={copyToats}
          dismissToast={actions.removeToast}
          toastLifeTimeMs={6000}
        />
    </SiteContext.Provider>
  )
}

export default SiteStateProvider