import { GuiBrowserObject, GuiBucket } from "types"
import { get, post } from '../driver'

interface APIResponse {
  
}

interface CommandResponse {
  
}

export default async (bucket: GuiBucket, objects: GuiBrowserObject[]): Promise<CommandResponse> => {
  const pathURL = `/bucket/${bucket.id}/key/delete`
  
  const { data } = await post<APIResponse>(pathURL, {
    keys: objects.map(obj => obj.path)
  })

  return {
    
  }
}