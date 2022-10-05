import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetBucketsCommand } from 'services/api';
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

    /**
     * When URL changes -> change current bucket
     */
    React.useEffect(() => {
      const bucketIDFromRoute: string | undefined = routeParams.bucket
      console.log(routeParams)

      if (bucketIDFromRoute) {
        setCurrentByID(bucketIDFromRoute)
      }
    }, [routeParams])

    /**
     * When apiAccessToken changes -> get buckets list
     */
    React.useEffect(() => {
      GetBucketsCommand()
        .then(({ buckets }) => {
          setBuckets(buckets)
        })
    }, [apiAccessToken])

    return (
      <BucketContext.Provider value={state}>
        {children}
      </BucketContext.Provider>
    );
  }

export default BucketContextProvider