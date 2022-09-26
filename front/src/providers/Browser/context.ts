import React, { useContext } from "react";
import { BrowserUtils } from "utils/BrowserUtils";
import { StringUtils } from "utils/StringUtils";
import { proxy, useSnapshot } from "valtio";
import { GuiBrowserFile, GuiBucket } from "types";

export interface IBrowserContext {
  bucket?: GuiBucket
  items: GuiBrowserFile[]
  current?: GuiBrowserFile,
  getByPath: (path: string) => GuiBrowserFile|undefined
}

const defaultData:IBrowserContext = {
  items: [],
  getByPath: (path:string): GuiBrowserFile|undefined => {
    return BrowserUtils.searchNaive(StringUtils.trim(path, '/'), state.items)
  }
}

export const state = proxy(defaultData)

export const actions = {

  setBucket: (bucket: GuiBucket, items: GuiBrowserFile[]): IBrowserContext => {

    BrowserUtils.resolveParentLinks(items)

    state.items = items
    state.current = undefined
    state.bucket = bucket

    return state
  },

  setCurrentByPath: (path: string): IBrowserContext => {
    if (path) {
      state.current = state.getByPath(path)
    } else {
      state.current = undefined
    }

    return state
  },

  deleteFile: (file: GuiBrowserFile): IBrowserContext => {
    state.items = BrowserUtils.deleteItem(state.items, file)

    if (state.current) { 
      state.current = state.getByPath(state.current.path)
    }

    return state
  }
}

export const BrowserContext = React.createContext<IBrowserContext>(state);