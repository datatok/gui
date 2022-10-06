import { post } from '../driver'

interface APIResponse {
  access_token: string
}

interface CommandResponse {
  token: string
}

export default async (username: string, password: string): Promise<CommandResponse> => {
  const pathURL = `/security/auth/login`
  
  const { data } = await post<APIResponse>(pathURL, {
    username,
    password
  })

  return {
    token: data.access_token
  }
}