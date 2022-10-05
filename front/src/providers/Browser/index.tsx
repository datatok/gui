
import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BucketBrowseCommand } from 'services/api';
import { GuiBrowserFile, GuiBucket } from 'types';
import { BrowserUtils } from 'utils/BrowserUtils';
import { GuiBucketUtils } from 'utils/GuiBucketUtils';
import { StringUtils } from 'utils/StringUtils';
import { IBrowserContext, BrowserContext } from './context';

interface BrowserStateProviderProps {
  selectedBucket: GuiBucket
  onRefreshingWorkflowChange: any
}

const BrowserStateProvider: FC<BrowserStateProviderProps> = ({selectedBucket, onRefreshingWorkflowChange, children}) => {

  const [state, setState] = useState<IBrowserContext>({
    rootNode: { name: '', prefix: '', path: '', type: 'folder'},
    currentFolderFiles: [],
    getByPath: (path:string): GuiBrowserFile|undefined => {
      return BrowserUtils.searchNaive(StringUtils.trim(path, '/'), state.rootNode.children)
    }
  })

  /**
   * Actions
   */

   const setBucket = (bucket: GuiBucket, rootFiles: GuiBrowserFile[]) => {

    BrowserUtils.resolveParentLinks(rootFiles)

    setState({
      ...state,
      bucket,
      rootNode: undefined,
      currentNode: undefined
    })
  }

  /** 
   * Set current view
   */
  const setFiles = (bucket: GuiBucket, fromPath: string, files: GuiBrowserFile[]) => {
    state.currentFolderFiles = files

    const currentNode = {
      ...BrowserUtils.extractNamePrefix(fromPath),
      type: 'folder',
      children: files
    }

    if (currentNode.name === '') {
      setState({
        ...state,
        bucket,
        rootNode: currentNode,
        currentNode
      })
    } else {
      const rootNode = BrowserUtils.reconciliateHierarchy(state.rootNode?.children || [], currentNode)

      setState({
        ...state,
        bucket,
        rootNode,
        currentNode
      })
    }
  }

  const setCurrentByPath = (path: string): IBrowserContext => {
    if (path) {
      state.currentNode = state.getByPath(path)
    } else {
      state.currentNode = undefined
    }

    return state
  }

  const deleteFile = (file: GuiBrowserFile): IBrowserContext => {
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