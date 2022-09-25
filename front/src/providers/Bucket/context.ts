import React, { useContext } from "react";
import { proxy, useSnapshot } from "valtio";
import { GuiBucket } from "types";

export interface IBucketContext {
  buckets: GuiBucket[]
  current?: GuiBucket,
  getByID: (path: string) => GuiBucket|undefined
}

const defaultData:IBucketContext = {
  buckets: [],
  getByID: (path:string): GuiBucket|undefined => {
    return state.buckets.filter(b => b.id === path).pop()
  }
}

export const state = proxy(defaultData)

export const actions = {
  setBuckets: (buckets: GuiBucket[]) => {
    state.buckets = buckets
    state.current = buckets[0]
  },

  setCurrentByID: (path: string) => {
    const found = state.getByID(path)

    state.current = found
  },
}

export const BucketContext = React.createContext<IBucketContext>(state);

export const useBucketStateSnapshot = ():IBucketContext => {
  return useSnapshot<IBucketContext>(useContext(BucketContext)) as IBucketContext
}