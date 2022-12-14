import {
  CopyObjectCommand,
  DeleteObjectsCommand,
  GetBucketAclCommand,
  GetBucketPolicyStatusCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { DownloadResults } from 'src/utils/DownloadResult';
import { S3DownloadStream } from 'src/utils/S3DownloadStream';
import { StringUtils } from '../../utils/StringUtils';
import { FileUpload, StorageBucket } from '../types';
import { StorageDriver } from './driver';

export class AWSStorageDriver implements StorageDriver {
  protected bucket: StorageBucket;
  protected client: S3;

  public constructor(bucket: StorageBucket) {
    this.bucket = bucket;

    const clientConfig: S3ClientConfig = {
      forcePathStyle: true,
      customUserAgent: 'AWS Javascript SDK / GUI',
    };

    if (bucket.region) {
      clientConfig.region = bucket.region;
    }

    if (bucket.endpoint) {
      clientConfig.endpoint = {
        hostname: bucket.endpoint.hostname,
        path: bucket.endpoint.path ?? '',
        port: bucket.endpoint.port ?? 443,
        protocol: `${bucket.endpoint.protocol ?? 'https'}:`,
      };
    }

    if (bucket.auth && bucket.auth.accessKey) {
      clientConfig.credentials = {
        accessKeyId: bucket.auth.accessKey,
        secretAccessKey: bucket.auth.secretKey,
      };
    }

    //clientConfig.logger = console;

    this.client = new S3(clientConfig);

    this.client.middlewareStack.add(
      (next) => (args) => {
        const request = args.request as Request;
        console.trace(request);
        return next(args);
      },
      {
        step: 'build',
      },
    );
  }

  public async status(): Promise<any> {
    let policyStatus;
    let acl;

    try {
      const ret = await this.client.send(
        new GetBucketPolicyStatusCommand({
          Bucket: this.bucket.name,
        }),
      );

      policyStatus = ret.PolicyStatus;
    } catch (err) {
      console.log(err);
      policyStatus = { error: err.message };
    }

    try {
      const ret = await this.client.send(
        new GetBucketAclCommand({
          Bucket: this.bucket.name,
        }),
      );

      acl = ret.Grants;
    } catch (err) {
      acl = { error: err.message };
    }

    return {
      policyStatus,
      acl,
    };
  }

  /**
   * Get all keys recurively
   * @param Prefix
   * @returns
   */
  public async listObjectsRecursive(
    Prefix: string,
    ContinuationToken?: string,
  ) {
    // Get objects for current prefix
    const listObjects = await this.client.send(
      new ListObjectsV2Command({
        Delimiter: '/',
        Bucket: this.bucket.name,
        Prefix,
        MaxKeys: 3,
        ContinuationToken,
      }),
    );

    let deepFiles, nextFiles;

    // Recurive call to get sub prefixes
    if (listObjects?.CommonPrefixes) {
      const deepFilesPromises = listObjects.CommonPrefixes.flatMap(
        ({ Prefix }) => {
          return this.listObjectsRecursive(Prefix);
        },
      );

      deepFiles = (await Promise.all(deepFilesPromises)).flatMap((t) => t);
    }

    // If we must paginate
    if (listObjects?.IsTruncated) {
      nextFiles = await this.listObjectsRecursive(
        Prefix,
        listObjects.NextContinuationToken,
      );
    }

    return [
      ...(listObjects?.Contents || []),
      ...(deepFiles || []),
      ...(nextFiles || []),
    ];
  }

  public async listObjects(
    argPrefix: string,
  ): Promise<
    { name: string; type: string; size?: number; editDate?: string }[]
  > {
    const data = await this.client.send(
      new ListObjectsV2Command({
        Delimiter: '/',
        Bucket: this.bucket.name,
        Prefix: argPrefix,
      }),
    );

    return [
      ...(data.CommonPrefixes
        ? data.CommonPrefixes.map((p) => {
            return {
              name: this.removePrefix(p.Prefix, argPrefix),
              type: 'folder',
            };
          })
        : []),
      ...(data.Contents
        ? data.Contents.map((f) => {
            return {
              name: this.removePrefix(f.Key, argPrefix),
              type: 'file',
              size: f.Size,
              editDate: f.LastModified,
            };
          })
        : []),
    ];
  }

  public async createFolder(path: string) {
    const results = await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket.name,
        Key: `${path}__meta.md`,
        ContentType: 'text/html; charset=UTF-8',
        Metadata: {
          author: 'Gui',
          type: 'folder',
        },
        Body: path,
      }),
    );

    return {
      path,
      results,
    };
  }

  /**
   * Copy then delete key.
   */
  public async moveKey(key: string, newKey: string) {
    const copyOperation = await this.copyKey(key, newKey);
    const deleteOperation = await this.deleteKeys([key]);

    return { copyOperation, deleteOperation };
  }

  /**
   * Copy key.
   */
  public async copyKey(key: string, newKey: string) {
    // See https://github.com/aws/aws-sdk-js/issues/1949
    const CopySource = encodeURI(`${this.bucket.name}/${key}`);

    const copyCommand = new CopyObjectCommand({
      Bucket: this.bucket.name,
      CopySource,
      Key: newKey,
    });

    const copyOperation = await this.client.send(copyCommand);

    return { copyOperation };
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

    const allKeysToRemovePromises = keys.map((k) =>
      this.listObjectsRecursive(k),
    );
    const allKeysToRemove = (
      await Promise.all(allKeysToRemovePromises)
    ).flatMap((k) => k);
    const allKeysToRemoveGroups = spliceIntoChunks(allKeysToRemove, 3);

    console.log(keys, allKeysToRemove);

    /**
     * Map keys chunks to delete in batch
     */
    const deletePromises = allKeysToRemoveGroups.map((group) => {
      return this.client.send(
        new DeleteObjectsCommand({
          Bucket: this.bucket.name,
          Delete: {
            Objects: group.map(({ Key }) => {
              return {
                Key,
              };
            }),
          },
        }),
      );
    });

    const results = await Promise.all(deletePromises);

    return results.flatMap(({ $metadata, Deleted }) => {
      return Deleted.map(({ Key }) => {
        return {
          status: $metadata.httpStatusCode,
          key: Key,
        };
      });
    });
  }

  public async uploadObjects(prefix: string, files: FileUpload[]) {
    const promises = files.map((file) => {
      const command = new PutObjectCommand({
        Bucket: this.bucket.name,
        ContentType: file.contentType,
        ContentLength: file.contentSize,
        Key: `${prefix}${file.key}`,
        Body: file.buffer,
      });

      return this.client.send(command);
    });

    return await Promise.all(promises);
  }

  public async putObject(key: string, body: any) {
    return this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket.name,
        Key: key,
        Body: body,
      }),
    );
  }

  /**
   * see https://dev.to/about14sheep/streaming-data-from-aws-s3-using-nodejs-stream-api-and-typescript-3dj0
   */
  public async downloadObject(key: string): Promise<DownloadResults> {
    const streamer = new S3DownloadStream({
      bucket: this.bucket.name,
      s3: this.client,
      key,
    });

    await streamer.run();

    return new DownloadResults(
      streamer.getContentLength(),
      streamer.getContentType(),
      streamer,
    );
  }

  public getClient() {
    return this.client;
  }

  protected removePrefix(str: string, prefix: string): string {
    if (prefix[0] === '/') {
      return StringUtils.trim(str, '/');
    }

    if (str.startsWith(prefix)) {
      return StringUtils.trim(str.substring(prefix.length), '/');
    }

    return StringUtils.trim(str, '/');
  }
}
