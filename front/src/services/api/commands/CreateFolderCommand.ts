import { GuiBrowserObject, GuiBucket } from "types"
import { get, post } from '../driver'

interface APIResponse {
  
}

interface CommandResponse {
  
}

export default async (bucket: GuiBucket, path: string): Promise<CommandResponse> => {
  const pathURL = `/bucket/${bucket.id}/key/create`
  
  const { data } = await post<APIResponse>(pathURL, {
    path
  })

  return {
    
  }
}