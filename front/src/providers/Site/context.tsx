import React from "react"

export interface ISiteState {
  title: string
  apiAccessToken: string
  toasts: any[]
}

export interface ISiteContext extends ISiteState {
  setTitle: (title: string) => void
  setApiAccessToken: (apiAccessToken: string) => void

  addSiteToast: (toast: any) => void
}

const defaultData:ISiteContext = {
  title: "GUI",
  apiAccessToken: localStorage.getItem('apiAccessToken'),
  toasts: [],
  setTitle: (title: string) => {},
  setApiAccessToken: (apiAccessToken: string) => {},
  addSiteToast: (toast: any) => {}
}

export const SiteContext = React.createContext<ISiteContext>(defaultData);