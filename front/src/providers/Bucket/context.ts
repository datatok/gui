import React from "react";
import { GuiBucket } from "types";

export interface IBucketState {
  buckets: GuiBucket[]
  current: GuiBucket | null

  fetchBucketsStatus: string
}

export interface IBucketContext extends IBucketState {

}

const defaultData:IBucketState = {
  buckets: [],
  current: null,
  fetchBucketsStatus: ''
}

export const BucketContext = React.createContext<IBucketContext>(defaultData);