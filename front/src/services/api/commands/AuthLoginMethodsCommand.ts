import { ApiCall } from '..'

/**
 * {
      label: 'Gitlab Oauth',
      href: '/auth/gitlab',
      iconType: 'link',
      size: 's',
    },
 */

export interface AuthMethod {
  name: string
  type: string
  provider: string
}

interface APIResponse {
  methods: AuthMethod[]
}

interface CommandResponse {
  methods: AuthMethod[]
}

export default (apiCall: ApiCall) => {
  return async (): Promise<CommandResponse> => {
    const pathURL = '/security/auth/methods'

    return await apiCall<APIResponse>('get', pathURL)
  }
}
