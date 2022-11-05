import { PipeTransform, Injectable } from '@nestjs/common';
import { AWSStorageDriver } from '../Drivers/aws-driver';
import { StorageService } from '../storage.service';
import { GetBucketPipe } from './get-bucket.pipe';
import { BucketsProviderService } from './storage.buckets.service';

@Injectable()
export class GetStorageDriverPipe implements PipeTransform {
  bucketPipe: GetBucketPipe;

  constructor(
    private bucketsProviderService: BucketsProviderService,
    private storageService: StorageService,
  ) {
    this.bucketPipe = new GetBucketPipe(bucketsProviderService);
  }

  transform(value: any): AWSStorageDriver | undefined {
    const bucket = this.bucketPipe.transform(value);

    return this.storageService.getInstance(bucket);
  }
}
