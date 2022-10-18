import { GuiBucket } from 'types'

export const GuiBucketUtils = {
  equals: (a: GuiBucket | null, b: GuiBucket | null): boolean => {
    if (a !== null && b !== null) {
      return a.id === b.id
    }

    return false
  }
}
