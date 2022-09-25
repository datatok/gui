import React, { useContext } from "react"
import { proxy, useSnapshot } from "valtio"

export interface ISiteContext {
  title: string
  apiAccessToken: string
}

const defaultData:ISiteContext = {
  title: "GUI",
  apiAccessToken: ""
}

export const state = proxy(defaultData)

export const actions = {
  setTitle: (t: string) => {
    state.title = t
  },

  setAPIAccessToken(v: string) {
    state.apiAccessToken = v
  }
}

export const SiteContext = React.createContext<ISiteContext>(state);