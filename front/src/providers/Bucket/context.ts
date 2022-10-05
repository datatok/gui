import React from "react";
import { GuiBucket } from "types";

export interface IBucketContext {
  buckets: GuiBucket[]
  current?: GuiBucket
}

const defaultData:IBucketContext = {
  buckets: []
}

export const BucketContext = React.createContext<IBucketContext>(defaultData);