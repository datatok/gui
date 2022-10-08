import { GuiBrowserObject, GuiBucket } from "types"
import { ApiCall } from '..'

interface APIResponse {
  
}

interface CommandResponse {
  
}

export default (apiCall: ApiCall) => {
  return async (bucket: GuiBucket, path: string): Promise<CommandResponse> => {
    const pathURL = `/bucket/${bucket.id}/key/create`
    
    const { data } = await apiCall<APIResponse>('post', pathURL, {
      path
    })

    return {
      
    }
  }
}