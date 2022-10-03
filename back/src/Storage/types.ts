interface StorageAuth {
  
}

interface StorageAuthBasic {
  name?: string
  accessKey: string
  secretKey: string
}

interface StorageEndpoint {
  name?: string
  protocol: string
  hostname: string
  port?: number
  path: string
}

interface StorageBucket {
  endpoint?: StorageEndpoint

  region?: string
  id?: string
  name: string

  auth?: StorageAuthBasic
}