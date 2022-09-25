import React, { useContext } from "react";
import { useSnapshot } from "valtio";
import { BucketContext, IBucketContext } from "./context";

export { actions as bucketActions } from './context'

export { default as BucketProvider } from './provider'

export const useBucketStateSnapshot = ():IBucketContext => {
  return useSnapshot<IBucketContext>(useContext(BucketContext)) as IBucketContext
}