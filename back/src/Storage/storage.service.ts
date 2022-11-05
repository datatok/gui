import { Injectable } from '@nestjs/common';
import { AWSStorageDriver } from './Drivers/aws-driver';
import { StorageBucket } from './types';

@Injectable()
export class StorageService {
  public getInstance(bucket: StorageBucket): AWSStorageDriver {
    return new AWSStorageDriver(bucket);
  }
}
