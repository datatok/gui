import { GuiBrowserFile, GuiBucket } from "types"
import { StringUtils } from "utils/StringUtils"
import { get } from '../driver'

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
  files: GuiBrowserFile[]
}

export default async (bucket: GuiBucket, argPath?: string): Promise<CommandResponse> => {
  const p = argPath ? `/${argPath}`: ''
  const pathURL = `/bucket/browse/${bucket.id}${p}`
  
  const { data } = await get<APIResponse>(pathURL)

  return {
    path: data.path,
    files: data.files.map(f => {
      return {
        ...f,
        prefix: argPath,
        path: StringUtils.pathJoin(argPath, f.name)
      } as GuiBrowserFile
    })
  }
}