import React from "react"

export interface ISiteState {
  
  toasts: any[]
}

export interface ISiteContext extends ISiteState {
  
  

  addSiteToast: (toast: any) => void

 
}

const defaultData:ISiteContext = {
  
  toasts: [],
  
  addSiteToast: (toast: any) => {},
 
}

export const SiteContext = React.createContext<ISiteContext>(defaultData);