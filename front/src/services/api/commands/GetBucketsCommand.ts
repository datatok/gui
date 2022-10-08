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
    
    const { data } = await apiCall<APIResponse>('get', pathURL)

    return {
      buckets: data.buckets
    }
  }
}