import React from "react";
import { GuiBrowserObject, GuiBucket, GuiObjects } from "types";

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
}

export interface IBrowserContext extends IBrowserState {
  getByPath: (path: string) => GuiBrowserObject|undefined
  refresh: () => void
}

const defaultData:IBrowserContext = {
  objects: {},
  currentKey: null,
  getByPath: (path:string): GuiBrowserObject|undefined => {return},
  refresh: () => {}
}

export const BrowserContext = React.createContext<IBrowserContext>(defaultData);