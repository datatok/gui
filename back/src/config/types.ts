export interface SecurityConfig {
  auth: {
    anonymous: {
      enabled: boolean;
    };

    gitlab: {
      enabled: boolean;
      clientID: string;
      clientSecret: string;
      baseURL: string;
    };
  };

  rbac: {
    enabled: boolean;
    items: {
      entity: string;
      rules: string[];
      buckets: {
        name: string;
        host: string;
      }[];
    }[];
  };
}

export interface StorageEndpointConfig {
  name: string;
  protocol?: string;
  hostname?: string;
  host?: string;
  port?: number;
  path?: string;
  region: string;
}

export interface StorageAuthConfig {
  name: string;
  basic: {
    accessKey: string;
    secretKey: string;
  };
}

interface StorageBucketConfig {
  name: string;
  title?: string;
  region?: string;
  auth?: string;
  endpoint?: string;
}

export interface StorageConfig {
  endpoints: StorageEndpointConfig[];
  auth: StorageAuthConfig[];
  buckets: StorageBucketConfig[];
}
