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
    argPath = argPath ? StringUtils.trim(argPath, '/') : ''
    const pathURL = `/bucket/${bucket.id}/browse`
    
    const { path, files } = await apiCall<APIResponse>('get', pathURL, {
      path: argPath
    })

    return {
      path,
      files: files.map(f => {
        return {
          ...f,
          prefix: argPath,
          path: StringUtils.pathJoin(argPath, f.name)
        } as GuiBrowserObject
      })
    }
  }
}