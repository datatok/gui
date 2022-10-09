
import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BucketBrowseCommand, useAPI } from 'services/api';
import { GuiBrowserObject, GuiBucket } from 'types';
import { BrowserUtils } from 'utils/BrowserUtils';
import { GuiBucketUtils } from 'utils/GuiBucketUtils';
import { StringUtils } from 'utils/StringUtils';
import { IBrowserContext, BrowserContext, IBrowserState } from './context';
import * as R from 'ramda'
import { string } from 'prop-types';

interface BrowserStateProviderProps {
  selectedBucket: GuiBucket
}

const BrowserStateProvider: FC<BrowserStateProviderProps> = ({selectedBucket, children}) => {

  const apiBucketBrowse = useAPI(BucketBrowseCommand)

  const browseFetchPointer = React.useRef({ status: '', cancelToken: null})

  const [state, setState] = useState<IBrowserState>({
    objects: {},
    currentKey: '',
    loadingStatus: null
  })

  /**
   * State Actions
   */
  const actions = {
    refresh: () => {
      console.log(state)
      getObjectChildren(state.currentKey)
    },

    getByPath: (path:string): GuiBrowserObject|undefined => {
      return state.objects[path]
    }
  }



   const setBucket = (bucket: GuiBucket, rootFiles: GuiBrowserObject[]) => {

    setState({
      ...state,
      bucket,
      currentNode: undefined
    })
  }

  /** 
   * Set current view
   */
  const setFiles = (fromPath: string, files: GuiBrowserObject[]) => {

    const currentNode = {
      ...BrowserUtils.extractNamePrefix(fromPath),
      type: 'folder',
      children: files
    }

    setState({
      ...state,
      objects: {
        ...state.objects,
        [currentNode.path]: currentNode,
        ...(R.indexBy(R.prop('path'), files))
      },
      currentKey: fromPath,
      currentNode,
      loadingStatus: { status: 'done' }
    })
  }

  const getObjectChildren = async (key: string) => {
    /*setState({
      ...state,
      loadingStatus: { status: 'loading' }
    })*/

    if (browseFetchPointer.current.status === 'progress') {
      return 
    }

    browseFetchPointer.current = {status: 'progress', cancelToken: null}

    try {
      const {files} = await apiBucketBrowse(selectedBucket, key)

      browseFetchPointer.current = {status: 'success', cancelToken: null}

      setFiles(key, files)
    } catch (err) {
      browseFetchPointer.current = {status: 'error', cancelToken: null}
      /*setState({
        ...state,
        loadingStatus: { status: 'error', message: err.message }
      })*/
    }
  }

  /**
   * Render
   */

  const routeParams = useParams()

  console.log("browser provider: refresh")

  React.useEffect( () => {
    if (!GuiBucketUtils.equals(selectedBucket, state.bucket)) {
      setBucket(selectedBucket, [])
    }
  }, [selectedBucket]);

  React.useEffect( () => {
    const bucketFromRoute = routeParams.bucket

    if (bucketFromRoute && state.bucket && GuiBucketUtils.equals(selectedBucket, state.bucket)) {
      const paramBrowsePath: string = routeParams['*'] || ''
      console.log(state.bucket)
      getObjectChildren(paramBrowsePath)
    }
  }, [state.bucket, routeParams])

  return (
    <BrowserContext.Provider value={{...state, ...actions}}>
      {children}
    </BrowserContext.Provider>
  );
}

export default BrowserStateProvider