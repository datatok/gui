import { useParams } from "react-router-dom"

import { actions, BucketContext, state } from "./context"

const BucketStateProvider = ({children}) => {

  const routeParams = useParams()

  const bucketIDFromRoute: string | undefined = routeParams.bucket

  if (bucketIDFromRoute) {
    actions.setCurrentByID(bucketIDFromRoute)
  }

  return (
    <BucketContext.Provider value={state}>
        {children}
    </BucketContext.Provider>
  )
}

export default BucketStateProvider