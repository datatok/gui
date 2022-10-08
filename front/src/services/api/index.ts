import { AxiosResponse } from 'axios'
import axios from 'axios'
import { SiteContext } from 'providers/Site/context'
import React from 'react'

export { default as BucketBrowseCommand} from './commands/BucketBrowseCommand'
export { default as AuthLoginCommand} from './commands/AuthLoginCommand'
export { default as GetBucketsCommand} from './commands/GetBucketsCommand'
export { default as CreateFolderCommand } from './commands/CreateFolderCommand'

export { default as useAuthAnonymousLogin } from './commands/AuthLoginAnonymousCommand'

export type ApiCall = <T>(method: string, url: string, data?: any) => Promise<AxiosResponse<T>>

export const useAPI = (command) => {
  const apiServer = "http://localhost:3001"
  const apiAccessToken = React.useContext(SiteContext).apiAccessToken

  const apiCall: ApiCall = <T>(method: string, pathURL: string, data?: any) => {
    const url = `${apiServer}${pathURL}`
    const headers = {
      Authorization: `Bearer ${apiAccessToken}`
    }
  
    return axios.request<T>({
      method,
      url,
      headers
    })
  }

  return command(apiCall)
}