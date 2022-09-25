import { BrowserContext, state } from "./context"

const provider = ({children}) => {
  return (
    <BrowserContext.Provider value={state}>
        {children}
    </BrowserContext.Provider>
  )
}

export default provider