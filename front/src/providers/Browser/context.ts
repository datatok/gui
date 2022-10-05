import React from "react";
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
    return 
  }
}

export const BrowserContext = React.createContext<IBrowserContext>(defaultData);