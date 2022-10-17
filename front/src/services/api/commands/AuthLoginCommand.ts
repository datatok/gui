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

    const { access_token } = await apiCall<APIResponse>('post', pathURL, {
      username,
      password
    })

    return {
      token: access_token
    }
  }
}
