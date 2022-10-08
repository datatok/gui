import React, { FC, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GetBucketsCommand, useAPI } from 'services/api';
import { GuiBucket } from 'types';
import { IBucketContext, BucketContext } from './context';

interface BucketContextProviderProps {
  apiAccessToken: string|undefined
}

const BucketContextProvider: FC<BucketContextProviderProps> = ({
  apiAccessToken,
  children
}) => {

  const [state, setState] = useState<IBucketContext>({
    buckets: [],
    current: null
  })

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

  const setCurrentByID = (path: string) => {
    const current =  getByID(path, state.buckets)

    setState({
      ...state,
      current
    })
  }

  const routeParams = useParams()
  const routeNavigate = useNavigate()

  /**
   * When URL changes -> change current bucket
   */
  React.useEffect(() => {
    const bucketIDFromRoute: string | undefined = routeParams.bucket

    if (bucketIDFromRoute) {
      setCurrentByID(bucketIDFromRoute)
    }
  }, [routeParams])

  /**
   * When apiAccessToken changes -> get buckets list
   */
  React.useEffect(() => {
    apiGetBuckets()
      .then(({ buckets }) => {
        setBuckets(buckets, routeParams.bucket)
      })
      .catch(({response}) => {
        if (response.status === 401) {
          routeNavigate('/auth')
        }
      })
  }, [apiAccessToken])

  return (
    <BucketContext.Provider value={state}>
      {children}
    </BucketContext.Provider>
  );
}

export default BucketContextProvider