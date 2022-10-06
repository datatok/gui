import { post } from '../driver'

interface APIResponse {
  access_token: string
}

interface CommandResponse {
  token: string
}

export default async (): Promise<CommandResponse> => {
  const pathURL = `/security/auth/anonymous`
  
  const { data } = await post<APIResponse>(pathURL, {})

  return {
    token: data.access_token
  }
}