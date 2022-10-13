import { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import React from 'react'
import { useAuthContext } from 'providers/AuthContext'
import { useNotificationContext } from 'providers/NotificationContext'

export { default as BucketBrowseCommand} from './commands/BucketBrowseCommand'
export { default as AuthLoginCommand} from './commands/AuthLoginCommand'
export { default as GetBucketsCommand} from './commands/GetBucketsCommand'
export { default as CreateFolderCommand } from './commands/CreateFolderCommand'
export { default as DeleteObjectCommand } from './commands/DeleteObjectCommand'
export { default as useAuthAnonymousLogin } from './commands/AuthLoginAnonymousCommand'

export type ApiCall = <T>(method: string, url: string, data?: any) => Promise<T>

//export type ApiCommand =  (apiCall: ApiCall) => () => Promise<any>

export const useAPI = (command: any) => {
  /**
   * Contexts
   */
  const apiServer = "http://localhost:3001"
  
  const { 
    addSiteToast 
  } = useNotificationContext()
  
  const authContext = useAuthContext()

  const apiCall: ApiCall = <T>(method: string, pathURL: string, data?: any) => {
    let url = `${apiServer}${pathURL}`

    method = method.toUpperCase()

    const headers = {
      Authorization: `Bearer ${authContext.apiAccessToken}`
    }

    if (method === 'UPLOAD') {
      headers["Content-Type"] = "multipart/form-data"
    }

    if (method === 'GET') {
      url += '?' + new URLSearchParams(data).toString()
    }

    const ret = new Promise<T>((resolve, reject) => {
      axios.request<T>({
        method: method === 'UPLOAD' ? 'POST' : method,
        url,
        headers,
        data,
        maxRedirects: 5,
      })
      .then((response:AxiosResponse) => {
        resolve(response.data)
      })
      .catch((err:AxiosError) => {
        let errorStr

        if (err.code === "ERR_NETWORK") {
          errorStr = err.message
        } else {
          if (err?.response?.status === 401) {
            errorStr = `Unauthorized (status ${err?.response?.status})`
          } 
        }

        if (errorStr) {
          addSiteToast({
            title: 'API error',
            color: 'warning',
            text: `API said "${errorStr}"`,
          })
        }
        console.log(err)

        reject(err)
      })
    })

    return ret
  }

  return command(apiCall)
}