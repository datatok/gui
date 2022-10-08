import React from "react";
import { GuiBucket } from "types";

export interface IBucketContext {
  buckets: GuiBucket[]
  current: GuiBucket | null
}

const defaultData:IBucketContext = {
  buckets: [],
  current: null
}

export const BucketContext = React.createContext<IBucketContext>(defaultData);