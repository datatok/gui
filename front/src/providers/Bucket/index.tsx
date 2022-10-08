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
    buckets: []
  })

  const apiGetBuckets = useAPI(GetBucketsCommand)

  const getByID = (path:string): GuiBucket|undefined => {
    return state.buckets.filter(b => b.id === path).pop()
  }

  const setBuckets = (buckets: GuiBucket[]) => {
    setState({
      ...state,
      buckets,
      current: buckets[0]
    })
  }

  const setCurrentByID = (path: string) => {
    const current =  getByID(path)

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
          setBuckets(buckets)
        })
        .catch(({response}) => {
          if (response.status === 401) {
            routeNavigate('/')
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