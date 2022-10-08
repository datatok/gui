import { GuiBrowserObject, GuiBucket } from "types"
import { StringUtils } from "utils/StringUtils"
import { ApiCall } from '..'

interface APIResponse {
  path: string,
  files: {
    name: string
    type: string
    size: number
    editDate: string
  }[]
}

interface CommandResponse {
  path: string
  files: GuiBrowserObject[]
}

export default (apiCall: ApiCall) => {
  return async (bucket: GuiBucket, argPath?: string): Promise<CommandResponse> => {
    const p = argPath ? StringUtils.trim(argPath, '/') : ''
    const pathURL = `/bucket/${bucket.id}/browse/${p}`
    
    const { data } = await apiCall<APIResponse>('get', pathURL)

    return {
      path: data.path,
      files: data.files.map(f => {
        return {
          ...f,
          prefix: argPath,
          path: StringUtils.pathJoin(argPath, f.name)
        } as GuiBrowserObject
      })
    }
  }
}