import { GuiBucket } from "types"
import { get } from '../driver'

interface APIResponse {
  buckets: GuiBucket[]
}

interface CommandResponse {
  buckets: GuiBucket[]
}

export default async (): Promise<CommandResponse> => {
  const pathURL = `/bucket`
  
  const { data } = await get<APIResponse>(pathURL)

  return {
    buckets: data.buckets
  }
}