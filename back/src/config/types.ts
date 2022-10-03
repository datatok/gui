interface SecurityConfig {
  auth: {
    anonymous: {
      enabled: boolean
    }
  }

  rbac: {
    enabled: boolean
    items: {
      entity: string
      rules: string[]
      buckets: {
        name: string
        host: string
      }[]
    }[]
  }
}

interface StorageEndpointConfig {
  name: string
  protocol?: string
  hostname?: string
  host?: string
  port?: number
  path?: string
  region: string
}

interface StorageAuthConfig {
  name: string
  basic: {
    accessKey: string
    secretKey: string
  }
}

interface StorageBucketConfig {
  name: string
  region?: string
  auth?: string
  endpoint?: string
}

interface StorageConfig {
  endpoints: StorageEndpointConfig[]
  auth: StorageAuthConfig[]
  buckets: StorageBucketConfig[]
}