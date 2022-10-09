import { ApiCall } from '..'

interface APIResponse {
  access_token: string
}

interface CommandResponse {
  token: string
}

export default (apiCall: ApiCall) => {
  return async ():Promise<CommandResponse> => {
    const pathURL = `/security/auth/anonymous`
    
    const { access_token } = await apiCall<APIResponse>('post', pathURL, {})

    return {
      token: access_token
    }
  }
}