import React, { FC, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GetBucketsCommand, useAPI } from 'services/api';
import { GuiBucket } from 'types';
import { BucketContext, IBucketState } from './context';

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

  const routeParams = useParams()
  const routeNavigate = useNavigate()

  /**
   * When URL changes -> change current bucket
   */
  React.useEffect(() => {
    const bucketIDFromRoute: string | undefined = routeParams.bucket

    setCurrentByID(bucketIDFromRoute)
  }, [routeParams])

  /**
   * When apiAccessToken changes -> get buckets list
   */
  React.useEffect(() => {
    if (fetchBucketsStatus.current === '') {

      fetchBucketsStatus.current = 'progress'

      apiGetBuckets()
        .then(({ buckets }) => {
          setBuckets(buckets, routeParams.bucket)
        })
        .catch(({response}) => {
          if (response.status === 401) {
            routeNavigate('/auth')
          }
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