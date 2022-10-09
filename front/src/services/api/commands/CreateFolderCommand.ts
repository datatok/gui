import { GuiBrowserObject, GuiBucket } from "types"
import { ApiCall } from '..'

interface APIResponse {
  status: string
}

interface CommandResponse {
  
}

export default (apiCall: ApiCall) => {
  return async (bucket: GuiBucket, path: string): Promise<CommandResponse> => {
    const pathURL = `/bucket/${bucket.id}/key/create`
    
    const { status } = await apiCall<APIResponse>('post', pathURL, {
      path
    })

    return {
      
    }
  }
}