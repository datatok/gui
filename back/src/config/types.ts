export interface RBACRuleConfig {
  title?: string;
  entity: {
    kind: string;
    name: string;
  };
  verbs: string[];
  resources: {
    bucket?: string;
    host?: string;
    path?: string;
  }[];
}

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
    rules: RBACRuleConfig[];
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
