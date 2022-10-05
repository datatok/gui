import React from "react"

export interface ISiteContext {
  title: string
  apiAccessToken: string
  toasts: any[]

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