import { GuiBucket } from 'types'
import { ApiCall } from '..'

interface APIResponse {
  status: string
}

interface CommandResponse extends APIResponse {

}

export default (apiCall: ApiCall) => {
  return async (bucket: GuiBucket, path: string): Promise<CommandResponse> => {
    const pathURL = `/bucket/${bucket.id}/key/create`

    const response = await apiCall<APIResponse>('post', pathURL, {
      path
    })

    return {
      status: response.status
    }
  }
}
