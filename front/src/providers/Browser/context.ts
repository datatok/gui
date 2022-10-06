import React from "react";
import { GuiBrowserObject, GuiBucket, GuiObjects } from "types";

export interface IBrowserContext {
  bucket?: GuiBucket

  /**
   * raw list
   */
  objects: GuiObjects

  /**
   * current path
   */
  currentKey: string

  /**
   * current selected (folder or file)
   */
  currentNode?: GuiBrowserObject,

  getByPath: (path: string) => GuiBrowserObject|undefined

}

const defaultData:IBrowserContext = {
  objects: {},
  currentKey: '',
  getByPath: (path:string): GuiBrowserObject|undefined => {return}
}

export const BrowserContext = React.createContext<IBrowserContext>(defaultData);