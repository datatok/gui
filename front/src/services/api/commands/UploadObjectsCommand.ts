import { GuiBucket } from 'types'
import { ApiCall } from '..'

interface APIResponse {
  status: string
}

interface CommandResponse {
  status: string
}

export default (apiCall: ApiCall) => {
  return async (bucket: GuiBucket, path: string, files: File[]): Promise<CommandResponse> => {
    const pathURL = `/bucket/${bucket.id}/upload`

    const formDataSubmit = new FormData()

    formDataSubmit.append('bucket', bucket.id)
    formDataSubmit.append('path', path)

    files.forEach(file => {
      formDataSubmit.append('files', file, file.name)
    })

    return await apiCall<APIResponse>('upload', pathURL, formDataSubmit)
  }
}
