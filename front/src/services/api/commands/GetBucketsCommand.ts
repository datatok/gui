import { GuiBucket } from "types"
import { ApiCall } from '..'

interface APIResponse {
  buckets: GuiBucket[]
}

interface CommandResponse {
  buckets: GuiBucket[]
}

export default (apiCall: ApiCall) => {
  return async (): Promise<CommandResponse> => {
    const pathURL = `/bucket`
    
    return await apiCall<APIResponse>('get', pathURL)
  }
}