import { SiteContext, state } from "./context"

const provider = ({children}) => {
  return (
    <SiteContext.Provider value={state}>
        {children}
    </SiteContext.Provider>
  )
}

export default provider