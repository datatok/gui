import { useBucketStateSnapshot } from "providers/Bucket/context"
import { useParams } from "react-router-dom"
import React, { FC, useState } from 'react';
import { actions, BrowserContext, state } from "./context"
import { getBucket } from "services/api";
import { GuiBucketUtils } from "utils/GuiBucketUtils";

interface BrowserStateProviderProps {
  onRefreshingWorkflowChange: (step: string, message?: string) => void
}

const BrowserStateProvider: FC<BrowserStateProviderProps> = ({ onRefreshingWorkflowChange, children}) => {

  const { current : bucket } = useBucketStateSnapshot()
  const routeParams = useParams()
  const bucketIDFromRoute: string | undefined = routeParams.bucket
  const paramBrowsePath: string | undefined = routeParams['*']

  React.useEffect( () => {
    if (!GuiBucketUtils.equals(bucket, state.bucket)) {
      actions.setBucket(bucket, [])

      onRefreshingWorkflowChange("loading")

      getBucket(bucket.id)
        .then(response => {
          actions.setBucket(bucket, response.data.files)
          
          onRefreshingWorkflowChange("done")
        })
        .catch(err => {
          onRefreshingWorkflowChange("error", err.message)
        })
    }

    if (paramBrowsePath) {
      actions.setCurrentByPath(paramBrowsePath)
    }
  }, [bucket, routeParams]);

  return (
    <BrowserContext.Provider value={state}>
        {children}
    </BrowserContext.Provider>
  )
}

export default BrowserStateProvider