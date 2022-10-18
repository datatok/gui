import React, { FC, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GetBucketsCommand, useAPI } from 'services/api'
import { GuiBucket } from 'types'

export interface IBucketState {
  buckets: GuiBucket[]
  current: GuiBucket | null

  fetchBucketsStatus: string
}

export interface IBucketContext extends IBucketState {

}

const defaultData: IBucketState = {
  buckets: [],
  current: null,
  fetchBucketsStatus: ''
}

export const BucketContext = React.createContext<IBucketContext>(defaultData)

/**
 * Export helpers
 */
export const useBucketContext = (): IBucketState => {
  // get the context
  const context = React.useContext(BucketContext)

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useUserContext was used outside of its Provider')
  }

  return context
}

/**
 * Export context provider
 */
const BucketContextProvider: FC = ({
  children
}) => {
  const [state, setState] = useState<IBucketState>({
    buckets: [],
    current: null,
    fetchBucketsStatus: ''
  })

  const fetchBucketsStatus = React.useRef('')

  console.log('bucket provider: refresh')

  const apiGetBuckets = useAPI(GetBucketsCommand)

  const getByID = (path: string, buckets: GuiBucket[]): GuiBucket | null => {
    const ret = buckets.find(b => b.id === path)

    return ret ?? null
  }

  const setBuckets = (buckets: GuiBucket[], currentID?: string): void => {
    setState({
      ...state,
      buckets,
      current: typeof currentID === 'undefined' ? null : getByID(currentID, buckets)
    })
  }

  const setCurrentByID = (path?: string | null): void => {
    if (path === null || typeof path === 'undefined') {
      setState({
        ...state,
        current: null
      })
    } else {
      if (state?.current?.id !== path) {
        const current = getByID(path, state.buckets)

        setState({
          ...state,
          current
        })
      }
    }
  }

  const { pathname } = useLocation()
  const routeNavigate = useNavigate()
  //
  // When URL changes -> change current bucket
  //
  React.useEffect(() => {
    if (pathname.startsWith('/bucket/')) {
      const bucketID = pathname.split('/')[2]

      setCurrentByID(bucketID)
    }
  }, [pathname, state.buckets])

  //
  // When apiAccessToken changes -> get buckets list
  //
  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const buckets = await apiGetBuckets()

      setBuckets(buckets)
    }

    if (fetchBucketsStatus.current === '') {
      fetchBucketsStatus.current = 'progress'

      fetchData()
        .catch(err => {
          if (err?.response?.status === 401) {
            routeNavigate('/auth')
          }

          console.log(err)
        })
    }
  }, [state.buckets])

  return (
    <BucketContext.Provider value={state}>
      {children}
    </BucketContext.Provider>
  )
}

export default BucketContextProvider
