import { Injectable } from '@nestjs/common';
import { AWSStorageDriver } from './Drivers/aws-driver';


@Injectable()
export class StorageService {
  public getInstance(bucket: StorageBucket): AWSStorageDriver {
    return new AWSStorageDriver(bucket)
  }
}
