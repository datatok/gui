import { ApiCall } from '..'

interface APIResponse {
  access_token: string
}

interface CommandResponse {
  token: string
}

export default (apiCall: ApiCall) => {
  return async (username: string, password: string): Promise<CommandResponse> => {
    const pathURL = '/security/auth/login'

    const response = await apiCall<APIResponse>('post', pathURL, {
      username,
      password
    })

    return {
      token: response.access_token
    }
  }
}
