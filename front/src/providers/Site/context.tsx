import { EuiGlobalToastListItemProps } from "@elastic/eui"
import React, { useContext } from "react"
import { proxy, useSnapshot } from "valtio"

export interface ISiteContext {
  title: string
  apiAccessToken: string
  toasts: any[]
}

const defaultData:ISiteContext = {
  title: "GUI",
  apiAccessToken: localStorage.getItem('apiAccessToken'),
  toasts: []
}

export const state = proxy(defaultData)

export const actions = {
  setTitle(t: string) {
    state.title = t
  },

  setAPIAccessToken(v: string) {
    state.apiAccessToken = v
    localStorage.setItem('apiAccessToken', v);
  },

  addToast(toast) {
    state.toasts.push({
      id: "t-" + state.toasts.length + 1,
      ...toast
    })
  },

  removeToast(removedToast) {
    state.toasts = state.toasts.filter((toast) => toast.id !== removedToast.id)
  }
}

export const SiteContext = React.createContext<ISiteContext>(state);