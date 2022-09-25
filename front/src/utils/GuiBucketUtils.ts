import { GuiBucket } from "types";

export const GuiBucketUtils = {
  equals: (a: GuiBucket, b: GuiBucket):boolean => {
    if (a && b) {
      return a.id === b.id
    }

    return false
  }
}