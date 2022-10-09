import { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import { SiteContext } from 'providers/Site/context'
import React from 'react'
import { useAuthContext } from 'providers/auth.context'

export { default as BucketBrowseCommand} from './commands/BucketBrowseCommand'
export { default as AuthLoginCommand} from './commands/AuthLoginCommand'
export { default as GetBucketsCommand} from './commands/GetBucketsCommand'
export { default as CreateFolderCommand } from './commands/CreateFolderCommand'
export { default as DeleteObjectCommand } from './commands/DeleteObjectCommand'
export { default as useAuthAnonymousLogin } from './commands/AuthLoginAnonymousCommand'

export type ApiCall = <T>(method: string, url: string, data?: any) => Promise<T>

//export type ApiCommand =  (apiCall: ApiCall) => () => Promise<any>

export const useAPI = (command: any) => {
  const apiServer = "http://localhost:3001"
  const { addSiteToast } = React.useContext(SiteContext)
  const authContext = useAuthContext()

  const apiCall: ApiCall = <T>(method: string, pathURL: string, data?: any) => {
    const url = `${apiServer}${pathURL}`
    const headers = {
      Authorization: `Bearer ${authContext.apiAccessToken}`
    }

    const ret = new Promise<T>((resolve, reject) => {
      axios.request<T>({
        method,
        url,
        headers,
        data,
        maxRedirects: 5,
      })
      .then((response:AxiosResponse) => {
        resolve(response.data)
      })
      .catch((err:AxiosError) => {
        if (err.code === "ERR_NETWORK") {
          addSiteToast({
            title: 'API error',
            color: 'warning',
            text: err.message,
          })
        }

        reject(err)
      })
    })

    return ret
  }

  return command(apiCall)
}