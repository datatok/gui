import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BucketBrowseCommand, useAPI } from 'services/api';
import { BrowserUtils } from 'utils/BrowserUtils';
import { GuiBucketUtils } from 'utils/GuiBucketUtils';
import * as R from 'ramda'
import { GuiBrowserObject, GuiBucket, GuiObjects } from "types";

interface LoadingStatus {
  status: string
  message?: string
  data?: any
}

export interface IBrowserState {
  bucket?: GuiBucket

  /**
   * raw list
   */
  objects: GuiObjects

  /**
   * current path
   */
  currentKey: string | null

  /**
   * current selected (folder or file)
   */
  currentNode?: GuiBrowserObject,

  /**
   * loading files status (loading / done)
   */
  loadingStatus: LoadingStatus | null,
}

export interface IBrowserContext extends IBrowserState {
  getByPath: (path: string) => GuiBrowserObject|undefined
  refresh: () => void
}

const defaultData:IBrowserContext = {
  objects: {},
  currentKey: null,
  loadingStatus: null,
  getByPath: (path:string): GuiBrowserObject|undefined => {return},
  refresh: () => {}
}

export const BrowserContext = React.createContext<IBrowserContext>(defaultData);

interface BrowserStateProviderProps {
  selectedBucket: GuiBucket
}

/**
 * Export helpers
 */
 export const useBrowserContext = (): IBrowserContext => {
  // get the context
  const context = React.useContext(BrowserContext);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error("useUserContext was used outside of its Provider");
  }

  return context;
}

/**
 * Export context provider
 */
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