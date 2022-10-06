
import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BucketBrowseCommand } from 'services/api';
import { GuiBrowserObject, GuiBucket } from 'types';
import { BrowserUtils } from 'utils/BrowserUtils';
import { GuiBucketUtils } from 'utils/GuiBucketUtils';
import { StringUtils } from 'utils/StringUtils';
import { IBrowserContext, BrowserContext } from './context';
import * as R from 'ramda'

interface BrowserStateProviderProps {
  selectedBucket: GuiBucket
  onRefreshingWorkflowChange: any
}

const BrowserStateProvider: FC<BrowserStateProviderProps> = ({selectedBucket, onRefreshingWorkflowChange, children}) => {

  const [state, setState] = useState<IBrowserContext>({
    objects: {},
    currentKey: '',
    getByPath: (path:string): GuiBrowserObject|undefined => {
      return state.objects[path]
    }
  })

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
  const setFiles = (bucket: GuiBucket, fromPath: string, files: GuiBrowserObject[]) => {

    const currentNode = {
      ...BrowserUtils.extractNamePrefix(fromPath),
      type: 'folder',
      children: files
    }

    setState({
      ...state,
      bucket,
      objects: {
        ...state.objects,
        [currentNode.path]: currentNode,
        ...(R.indexBy(R.prop('path'), files))
      },
      currentKey: fromPath,
      currentNode
    })
  }

  const setCurrentByPath = (path: string): IBrowserContext => {
    if (path) {
      state.currentNode = state.getByPath(path)
    } else {
      state.currentNode = undefined
    }

    return state
  }

  const deleteFile = (file: GuiBrowserObject): IBrowserContext => {
    //state.rootNode = BrowserUtils.deleteItem(state.rootNode, file)

    if (state.currentNode) { 
      state.currentNode = state.getByPath(state.currentNode.path)
    }

    return state
  }

  /**
   * Render
   */

  const routeParams = useParams()

  React.useEffect( () => {
    const paramBrowsePath: string = routeParams['*'] || ''

    if (selectedBucket) {
      
      if (!GuiBucketUtils.equals(selectedBucket, state.bucket)) {
        setBucket(selectedBucket, [])
      }

      onRefreshingWorkflowChange("loading")

      BucketBrowseCommand(selectedBucket, paramBrowsePath)
        .then(({files}) => {
          setFiles(selectedBucket, paramBrowsePath, files)
          
          onRefreshingWorkflowChange("done")
        })
        .catch(err => {
          onRefreshingWorkflowChange("error", err.message)
        })
    }
  }, [selectedBucket, routeParams]);

  return (
    <BrowserContext.Provider value={state}>
      {children}
    </BrowserContext.Provider>
  );
}

export default BrowserStateProvider