import { DeleteObjectCommand, DeleteObjectsCommand, DeleteObjectsCommandOutput, GetBucketAclCommand, GetBucketPolicyStatusCommand, ListObjectsCommand, ListObjectsV2Command, PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3"
import * as R from 'ramda'
import { DeleteKeysDto } from "../Buckets/dto/delete-keys.dto"

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

  /**
   * Get all keys recurively
   * @param Prefix 
   * @returns 
   */
  public async listObjectsRecursive(Prefix: string, ContinuationToken?: string): Promise<
    {Key: string}[]
  > {
    // Get objects for current prefix
    const listObjects = await this.client.send(
      new ListObjectsV2Command({
        Delimiter: "/",
        Bucket: this.bucket.name,
        Prefix,
        MaxKeys: 3,
        ContinuationToken
      })
    );

    let deepFiles, nextFiles

    // Recurive call to get sub prefixes
    if (listObjects.CommonPrefixes) {
      const deepFilesPromises = listObjects.CommonPrefixes.flatMap(({Prefix}) => {
        return this.listObjectsRecursive(Prefix)
      })

      deepFiles = (await Promise.all(deepFilesPromises)).flatMap(t => t)
    }

    // If we must paginate
    if (listObjects.IsTruncated) {
      nextFiles = await this.listObjectsRecursive(Prefix, listObjects.NextContinuationToken)
    }

    return [
      ...(listObjects.Contents || []),
      ...(deepFiles || []),
      ...(nextFiles || [])
    ]
  }

  public async listObjects(path: string ): Promise<
    {name: string, type: string, size?: number, editDate?: string}[]
  > {
    if (!R.endsWith('/', path)) {
      path += '/'
    }
    
    const data = await this.client.send(
      new ListObjectsV2Command({
        Delimiter: "/",
        Bucket: this.bucket.name,
        Prefix: path,
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

  /**
   * AWS S3 response: {
      $metadata: {
        httpStatusCode: 200,
        requestId: undefined,
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0,
      },
      ETag: "\"8876e0f9bd7405e103539649dca68e96\"",
    }
   */
  public async createFolder(path: string) {
    try {
      const res = await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket.name,
          Key: `${path}/_meta.md`,
          ContentType: 'text/html; charset=UTF-8',
          Metadata: {
            author: 'Gui',
            type: 'folder'
          },
          Body: path
        })
      )

      return {
        path
      }
    }
    catch(err) {
      console.log(err)
    }
  }

  public async deleteKeys(keys: string[]): Promise<any[]> {
    
    function spliceIntoChunks(arr: any[], chunkSize: number) {
      const res = [];
      while (arr.length > 0) {
          const chunk = arr.splice(0, chunkSize);
          res.push(chunk);
      }
      return res;
    }

    const allKeysToRemovePromises =  keys.map(k => this.listObjectsRecursive(k))
    const allKeysToRemove = (await Promise.all(allKeysToRemovePromises)).flatMap(k => k)      
    const allKeysToRemoveGroups = spliceIntoChunks(allKeysToRemove, 3)

    const deletePromises = allKeysToRemoveGroups.map(group => {
      return this.client.send(
        new DeleteObjectsCommand({
          Bucket: this.bucket.name,
          Delete: {
            Objects: group.map(({Key}) => {
              return {
                Key
              }
            })
          }
        })
      )
    })

    const results = await Promise.all(deletePromises)

    return results.flatMap(({$metadata, Deleted}) => {
      return Deleted.map(({Key}) => {
        return {
          status: $metadata.httpStatusCode,
          key: Key
        }
      })
    })
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