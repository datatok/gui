import { get } from '../driver'

interface APIResponse {
  token: string
}

interface CommandResponse {
  token: string
}

export default async (): Promise<CommandResponse> => {
  const pathURL = `/security/auth/anonymous`
  
  const { data } = await get<APIResponse>(pathURL)

  return {
    token: data.token
  }
}