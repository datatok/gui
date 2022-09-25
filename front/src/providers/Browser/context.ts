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

  setBucket: (bucket: GuiBucket): IBrowserContext => {

    if (state.bucket !== bucket) {
      state.items = []
      state.current = undefined
    }

    state.bucket = bucket

    return state
  },

  setItems: (items: GuiBrowserFile[]): IBrowserContext => {
    state.items = items

    return state
  },

  setCurrentByPath: (path: string): IBrowserContext => {
    const found = state.getByPath(path)

    state.current = found

    return state
  },
}

export const BrowserContext = React.createContext<IBrowserContext>(state);