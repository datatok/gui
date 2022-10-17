import { GuiBucket } from "types"
import { ApiCall } from '..'

interface APIBucket {
  endpoint: {
    hostname: string
    protocol: string
    port: number
  }
  
  id: string
  name: string
  region: string
}

interface APIResponse {
  buckets: APIBucket[]
}

export default (apiCall: ApiCall) => {
  return async (): Promise<GuiBucket[]> => {
    const pathURL = `/bucket`
    
    const response = await apiCall<APIResponse>('get', pathURL)

    return response.buckets.map(({
      id, name, endpoint
    }): GuiBucket => {
      return {
        id,
        name,
        host: endpoint?.hostname
      }
    })
  }
}