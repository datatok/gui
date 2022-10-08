
import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BucketBrowseCommand, useAPI } from 'services/api';
import { GuiBrowserObject, GuiBucket } from 'types';
import { BrowserUtils } from 'utils/BrowserUtils';
import { GuiBucketUtils } from 'utils/GuiBucketUtils';
import { StringUtils } from 'utils/StringUtils';
import { IBrowserContext, BrowserContext, IBrowserState } from './context';
import * as R from 'ramda'

interface BrowserStateProviderProps {
  selectedBucket: GuiBucket
}

const BrowserStateProvider: FC<BrowserStateProviderProps> = ({selectedBucket, children}) => {

  const [state, setState] = useState<IBrowserState>({
    objects: {},
    currentKey: '',
    loadingStatus: null
  })

  const apiBucketBrowse = useAPI(BucketBrowseCommand)

  const refresh = () => {
    console.log(state)
    getObjectChildren(state.currentKey)
  }

  const getByPath = (path:string): GuiBrowserObject|undefined => {
    return state.objects[path]
  }

  /**
   * Actions
   */

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

  const getObjectChildren = (key: string) => {
    /*setState({
      ...state,
      loadingStatus: { status: 'loading' }
    })*/

    apiBucketBrowse(selectedBucket, key)
      .then(({files}) => {
        setFiles(key, files)
      })
      .catch(err => {
        setState({
          ...state,
          loadingStatus: { status: 'error', message: err.message }
        })
      })
  }

  /**
   * Render
   */

  const routeParams = useParams()

  React.useEffect( () => {
    const paramBrowsePath: string = routeParams['*'] || ''

    console.log(selectedBucket)

    if (selectedBucket) {
      
      if (!GuiBucketUtils.equals(selectedBucket, state.bucket)) {
        setBucket(selectedBucket, [])
      }
      
      //
    }
  }, [selectedBucket]);

  React.useEffect( () => {
    const paramBrowsePath: string = routeParams['*'] || ''
    getObjectChildren(paramBrowsePath)
  }, [ state.bucket, routeParams])

  return (
    <BrowserContext.Provider value={{...state, refresh, getByPath}}>
      {children}
    </BrowserContext.Provider>
  );
}

export default BrowserStateProvider