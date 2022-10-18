import { GuiBrowserObject, GuiBucket } from 'types'
import { ApiCall } from '..'

interface APIResponse {
  status: string
}

interface CommandResponse extends APIResponse {}

export default (apiCall: ApiCall) => {
  return async (bucket: GuiBucket, objects: GuiBrowserObject[]): Promise<CommandResponse> => {
    const pathURL = `/bucket/${bucket.id}/key/delete`

    const response = await apiCall<APIResponse>('post', pathURL, {
      keys: objects.map(obj => obj.path)
    })

    return {
      status: response.status
    }
  }
}
