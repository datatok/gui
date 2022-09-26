import { useSiteStateSnapshot } from "providers/Site"
import React from "react"
import { useParams } from "react-router-dom"
import { getBuckets } from "services/api"

import { actions, BucketContext, state } from "./context"

const BucketStateProvider = ({children}) => {

  const routeParams = useParams()
  const authState = useSiteStateSnapshot()

  /**
   * When URL changes -> change current bucket
   */
  React.useEffect(() => {
    const bucketIDFromRoute: string | undefined = routeParams.bucket

    if (bucketIDFromRoute) {
      actions.setCurrentByID(bucketIDFromRoute)
    }
  }, [routeParams])

  /**
   * When apiAccessToken changes -> get buckets list
   */
  React.useEffect(() => {
    getBuckets()
      .then(response => {
        const { buckets } = response.data

        actions.setBuckets(buckets)
      })
  }, [authState.apiAccessToken])

  return (
    <BucketContext.Provider value={state}>
        {children}
    </BucketContext.Provider>
  )
}

export default BucketStateProvider