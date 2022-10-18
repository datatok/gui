import { GuiBrowserObject, GuiBucket } from 'types'
import { ApiCall } from '..'

interface APIResponse {
  copyOperation: any
}

interface CommandResponse extends APIResponse {

}

export default (apiCall: ApiCall) => {
  return async (bucket: GuiBucket, item: GuiBrowserObject, targetKey: string): Promise<CommandResponse> => {
    const pathURL = `/bucket/${bucket.id}/key/copy`

    const response = await apiCall<APIResponse>('post', pathURL, {
      sourceKey: item.path,
      targetKey
    })

    return response
  }
}
