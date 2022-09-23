import React from "react";
import { BrowserUtils } from "utils/BrowserUtils";
import { StringUtils } from "utils/StringUtils";
import { proxy } from "valtio";
import { getFiles } from "../../utils/DummyData";
import { GuiBrowserFile } from "./types";

interface IBrowserContext {
  items: GuiBrowserFile[]
  current?: GuiBrowserFile,
  getByPath: (path: string) => GuiBrowserFile|undefined
}

const defaultData:IBrowserContext = {
  items: getFiles(),
  getByPath: (path:string): GuiBrowserFile|undefined => {
    return BrowserUtils.searchNaive(StringUtils.trim(path, '/'), state.items)
  }
}

export const state = proxy(defaultData)

export const actions = {
  setCurrentByPath: (path: string) => {
    const found = state.getByPath(path)

    state.current = found
  },
}

export const BrowserContext = React.createContext<IBrowserContext>(state);