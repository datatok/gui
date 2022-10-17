import { ApiCall } from '..'

interface APIResponse {
  username: string
}

interface CommandResponse {
  username: string
}

export default (apiCall: ApiCall) => {
  return async (): Promise<CommandResponse> => {
    const pathURL = '/security/auth/user'

    const response = await apiCall<APIResponse>('get', pathURL)

    return {
      username: response.username
    }
  }
}
