import { useBucketStateSnapshot } from "providers/Bucket/context"
import { useLocation, useParams } from "react-router-dom"
import React, { FC, useState } from 'react';
import { actions, BrowserContext, state } from "./context"
import { GuiBucketUtils } from "utils/GuiBucketUtils";
import { BucketBrowseCommand } from "services/api";

interface BrowserStateProviderProps {
  onRefreshingWorkflowChange: (step: string, message?: string) => void
}

const BrowserStateProvider: FC<BrowserStateProviderProps> = ({ onRefreshingWorkflowChange, children}) => {

  const { current : bucket } = useBucketStateSnapshot()
  const routeParams = useParams()
  const routeLocatioh = useLocation()

  console.log(routeLocatioh, routeParams)

  React.useEffect( () => {
    const paramBrowsePath: string | undefined = routeParams['*']

    if (bucket && !GuiBucketUtils.equals(bucket, state.bucket)) {
      actions.setBucket(bucket, [])

      onRefreshingWorkflowChange("loading")

      BucketBrowseCommand(bucket, paramBrowsePath || '')
        .then(({files}) => {
          actions.setFiles(paramBrowsePath || '', files)
          
          onRefreshingWorkflowChange("done")
        })
        .catch(err => {
          onRefreshingWorkflowChange("error", err.message)
        })
    }

    if (bucket && paramBrowsePath) {
      actions.setCurrentByPath(paramBrowsePath)

      onRefreshingWorkflowChange("loading")

      BucketBrowseCommand(bucket, paramBrowsePath || '')
        .then(({files}) => {
          actions.setFiles(paramBrowsePath || '', files)
          
          onRefreshingWorkflowChange("done")
        })
        .catch(err => {
          onRefreshingWorkflowChange("error", err.message)
        })
    }
  }, [bucket, routeParams]);

  return (
    <BrowserContext.Provider value={state}>
        {children}
    </BrowserContext.Provider>
  )
}

export default BrowserStateProvider