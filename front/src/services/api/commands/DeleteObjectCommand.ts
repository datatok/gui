import { GuiBrowserObject, GuiBucket } from 'types'
import { ApiCall } from '..'

interface APIResponse {
  status: string
}

interface CommandResponse {

}

export default (apiCall: ApiCall) => {
  return async (bucket: GuiBucket, objects: GuiBrowserObject[]): Promise<CommandResponse> => {
    const pathURL = `/bucket/${bucket.id}/key/delete`

    const { status } = await apiCall<APIResponse>('post', pathURL, {
      keys: objects.map(obj => obj.path)
    })

    return {

    }
  }
}
