import { GuiBrowserFile, GuiBucket } from "types"
import { get } from '../driver'

interface APIResponse {
  
}

interface CommandResponse {
  
}

export default async (bucket: GuiBucket, objects: GuiBrowserFile[]): Promise<CommandResponse> => {
  const pathURL = `/bucket/delete-objects/${bucket.id}`
  
  const { data } = await get<APIResponse>(pathURL)

  return {
    
  }
}