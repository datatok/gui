import { BucketContext, state } from "./context"

const provider = ({children}) => {
  return (
    <BucketContext.Provider value={state}>
        {children}
    </BucketContext.Provider>
  )
}

export default provider