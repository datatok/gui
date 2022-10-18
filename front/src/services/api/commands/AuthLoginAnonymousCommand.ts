import { ApiCall } from '..'

interface APIResponse {
  access_token: string
}

interface CommandResponse {
  token: string
}

export default (apiCall: ApiCall) => {
  return async (): Promise<CommandResponse> => {
    const pathURL = '/security/auth/anonymous'

    const response = await apiCall<APIResponse>('post', pathURL, {})

    return {
      token: response.access_token
    }
  }
}
