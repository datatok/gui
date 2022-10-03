import { GetBucketAclCommand, GetBucketPolicyStatusCommand, ListObjectsCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3"
import * as R from 'ramda'

export class AWSStorageDriver {
  protected bucket: StorageBucket
  protected client:S3Client

  public constructor(bucket: StorageBucket) {
    this.bucket = bucket
    
    const clientConfig:S3ClientConfig = {
      forcePathStyle: true,
    }

    if (bucket.region) {
      clientConfig.region = bucket.region
    }

    if (bucket.endpoint) {
      clientConfig.endpoint = {
        hostname: bucket.endpoint.hostname,
        path: bucket.endpoint.path,
        port: bucket.endpoint.port,
        protocol: bucket.endpoint.protocol
      }
    }

    if (bucket.auth && bucket.auth.accessKey) {
      clientConfig.credentials = {
        accessKeyId: bucket.auth.accessKey,
        secretAccessKey: bucket.auth.secretKey
      }
    }

    this.client = new S3Client(clientConfig)
  }

  public async status(): Promise<any> {
    let policyStatus
    let acl

    try {
      const ret = await this.client.send(
        new GetBucketPolicyStatusCommand({
          Bucket: this.bucket.name,
        })
      )

      policyStatus = ret.PolicyStatus
    } catch(err) {
      console.log(err)
      policyStatus = { error : err.message }
    }

    try {
      const ret = await this.client.send(
        new GetBucketAclCommand({
          Bucket: this.bucket.name,
        })
      )

      acl = ret.Grants
    } catch(err) {
      acl = { error : err.message }
    }

    return {
      policyStatus,
      acl
    }
  }

  public async listObjects(path: string ): Promise<
    {name: string, type: string, size?: number, editDate?: string}[]
  > {
    if (!R.endsWith('/', path)) {
      path += '/'
    }
    
    const data = await this.client.send(
      new ListObjectsCommand({
        Delimiter: "/",
        Bucket: this.bucket.name,
        Prefix: path
      })
    );
    
    return [
      ...(data.CommonPrefixes ? data.CommonPrefixes.map(p => { 
        return {
          name: this.removePrefix(p.Prefix, path),
          type: "folder"
        }
      }) : []),
      ...(data.Contents ? data.Contents.map(f => {
        return {
          name: this.removePrefix(f.Key, path),
          type: "file",
          size: f.Size,
          editDate: f.LastModified
        }
      }) : [])
    ]
  }

  public getClient() {
    return this.client
  }

  protected removePrefix(str: string, prefix: string): string {
    if (prefix === '/') {
      return str
    }
    
    return str.substring(prefix.length)
  }
}