interface StorageAuthBasic {
  name?: string;
  accessKey: string;
  secretKey: string;
}

interface StorageEndpoint {
  name?: string;
  protocol: string;
  hostname: string;
  port?: number;
  path: string;
}

export interface StorageBucket {
  endpoint?: StorageEndpoint;

  region?: string;
  id?: string;
  name: string;
  title: string;

  auth?: StorageAuthBasic;
}

export interface FileUpload {
  key: string;
  contentType: string;
  contentSize: number;
  buffer: Buffer;
}
