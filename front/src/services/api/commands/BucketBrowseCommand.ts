import { GuiBrowserObject, GuiBucket } from 'types'
import { StringUtils } from 'utils/StringUtils'
import { ApiCall } from '..'

interface APIResponse {
  path: string
  files: Array<{
    name: string
    type: string
    size: number
    editDate: string
    downloadLink: string
  }>
}

interface CommandResponse {
  path: string
  files: GuiBrowserObject[]
}

export default (apiCall: ApiCall) => {
  return async (bucket: GuiBucket, argPath?: string): Promise<CommandResponse> => {
    const argPathFix = argPath === undefined ? '' : StringUtils.trim(argPath, '/')
    const pathURL = `/bucket/${bucket.id}/browse`

    const { path, files } = await apiCall<APIResponse>('get', pathURL, {
      path: argPathFix
    })

    return {
      path,
      files: files.map((f): GuiBrowserObject => {
        return {
          ...f,
          prefix: argPathFix,
          path: StringUtils.pathJoin(argPath, f.name)
        }
      })
    }
  }
}
