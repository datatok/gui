import React, { FC, useState } from 'react';
import { useParams, useNavigate, useLocation, matchPath } from 'react-router-dom';
import { GetBucketsCommand, useAPI } from 'services/api';
import { GuiBucket } from 'types';
import { StringUtils } from 'utils/StringUtils';

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

/**
 * Export helpers
 */
 export const useBucketContext = (): IBucketState => {
  // get the context
  const context = React.useContext(BucketContext);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error("useUserContext was used outside of its Provider");
  }

  return context;
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

  console.log("bucket provider: refresh")

  const apiGetBuckets = useAPI(GetBucketsCommand)

  const getByID = (path:string, buckets:GuiBucket[]): GuiBucket|null => {
    return buckets.find(b => b.id === path) || null
  }

  const setBuckets = (buckets: GuiBucket[], currentID?: string) => {
    setState({
      ...state,
      buckets,
      current: currentID ? getByID(currentID, buckets) : null
    })
  }

  const setCurrentByID = (path?: string | null) => {
    
    if (path === null || typeof path === 'undefined') {
      setState({
        ...state,
        current: null
      })
    } else {
      if (state?.current?.id !== path) {
        const current =  getByID(path, state.buckets)

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

    const fetchData = async () => {
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
  );
}

export default BucketContextProvider