import axios, { AxiosError, AxiosResponse } from 'axios'
import { useCallback } from 'react'
import { IAPISecurityState, useAuthContext } from 'providers/AuthContext'
import { useNotificationContext } from 'providers/NotificationContext'
import { useConfigContext } from 'providers/ConfigContext'

export { default as BucketBrowseCommand } from './commands/BucketBrowseCommand'
export { default as AuthLoginCommand } from './commands/AuthLoginCommand'
export { default as GetBucketsCommand } from './commands/GetBucketsCommand'
export { default as CreateFolderCommand } from './commands/CreateFolderCommand'
export { default as DeleteObjectCommand } from './commands/DeleteObjectCommand'
export { default as useAuthAnonymousLogin } from './commands/AuthLoginAnonymousCommand'
export { default as AuthLoginMethodsCommand } from './commands/AuthLoginMethodsCommand'
export { default as AuthGetUser } from './commands/AuthGetUser'

export type ApiCall = <T>(method: string, url: string, data?: any) => Promise<T>

export type ApiCommand = (...args: any[]) => Promise<any>

export const useAPI = (command: any, securityContext?: IAPISecurityState): ApiCommand => {
  const authContext = useAuthContext()

  const {
    addSiteToast
  } = useNotificationContext()

  const configContext = useConfigContext()

  if (typeof securityContext === 'undefined') {
    securityContext = authContext
  }

  const queryCallback = useCallback(
    async <T>(method: string, pathURL: string, data?: any) => {
      let url = `${configContext.apiBaseURL}${pathURL}`

      method = method.toUpperCase()

      const headers = {}

      if (typeof securityContext?.apiAccessToken !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        headers['Authorization'] = `Bearer ${securityContext.apiAccessToken}`
      }

      if (method === 'UPLOAD') {
        headers['Content-Type'] = 'multipart/form-data'
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
          maxRedirects: 5
        })
          .then((response: AxiosResponse) => {
            resolve(response.data)
          })
          .catch((err: AxiosError) => {
            let errorStr: string = ''

            if (err.code === 'ERR_NETWORK') {
              errorStr = err.message
            } else {
              if (err?.response?.status === 401) {
                errorStr = `Unauthorized (status ${err?.response?.status})`
              }
            }

            if (errorStr !== '') {
              addSiteToast({
                title: 'API error',
                color: 'warning',
                text: `API said "${errorStr}"`
              })
            }
            console.log(err)

            reject(err)
          })
      })

      return await ret
    }, [securityContext.apiAccessToken, configContext.apiBaseURL])

  return command(queryCallback)
}
