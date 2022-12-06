import { Injectable } from '@nestjs/common';
import { AWSStorageDriver } from './Drivers/aws-driver';
import { LocalFSDriver } from './Drivers/local-fs-driver';
import { StorageBucket } from './types';

@Injectable()
export class StorageService {
  public getInstance(bucket: StorageBucket): StorageDriver {
    if (bucket.path) {
      return new LocalFSDriver(bucket.path);
    }

    return new AWSStorageDriver(bucket);
  }
}
