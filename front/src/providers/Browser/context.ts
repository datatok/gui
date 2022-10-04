import React, { useContext, useState } from "react";
import { BrowserUtils } from "utils/BrowserUtils";
import { StringUtils } from "utils/StringUtils";
import { proxy, useSnapshot } from "valtio";
import { GuiBrowserFile, GuiBucket } from "types";

export interface IBrowserContext {
  bucket?: GuiBucket
  /**
   * hold the tree-view
   */
  rootNode: GuiBrowserFile

  /**
   * files to show
   */
  currentFolderFiles: GuiBrowserFile[]

  /**
   * current selected (folder or file)
   */
  currentNode?: GuiBrowserFile,
  getByPath: (path: string) => GuiBrowserFile|undefined
}

const defaultData:IBrowserContext = {
  rootNode: { name: '', prefix: '', path: '', type: 'folder'},
  currentFolderFiles: [],
  getByPath: (path:string): GuiBrowserFile|undefined => {
    return BrowserUtils.searchNaive(StringUtils.trim(path, '/'), state.rootNode.children)
  }
}

export const [state, setState] = useState(defaultData)

export const actions = {

  setBucket: (bucket: GuiBucket, rootFiles: GuiBrowserFile[]): IBrowserContext => {

    BrowserUtils.resolveParentLinks(rootFiles)

    state.currentNode = undefined
    state.bucket = bucket

    return state
  },

  /** 
   * Set current view
   */
  setFiles: (fromPath: string, files: GuiBrowserFile[]): IBrowserContext => {
    state.currentFolderFiles = files

    const currentNode = {
      ...BrowserUtils.extractNamePrefix(fromPath),
      type: 'folder',
      children: files
    }

    state.rootNode = BrowserUtils.reconciateHierarchy(state.rootNode?.children || [], currentNode)
    
    state.currentNode = BrowserUtils.searchNaive(currentNode.path, state.rootNode.children)

    return state
  },

  setCurrentByPath: (path: string): IBrowserContext => {
    if (path) {
      state.currentNode = state.getByPath(path)
    } else {
      state.currentNode = undefined
    }

    return state
  },

  deleteFile: (file: GuiBrowserFile): IBrowserContext => {
    //state.rootNode = BrowserUtils.deleteItem(state.rootNode, file)

    if (state.currentNode) { 
      state.currentNode = state.getByPath(state.currentNode.path)
    }

    return state
  }
}

export const BrowserContext = React.createContext<IBrowserContext>(state);