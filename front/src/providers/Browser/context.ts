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
    console.log([...state.items])
    return BrowserUtils.searchNaive(StringUtils.trim(path, '/'), state.items)
  }
}

export const state = proxy(defaultData)

export const actions = {

  setBucket: (bucket: GuiBucket, items: GuiBrowserFile[]): IBrowserContext => {

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
}

export const BrowserContext = React.createContext<IBrowserContext>(state);