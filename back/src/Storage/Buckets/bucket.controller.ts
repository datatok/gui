import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as R from 'ramda'

import {
    ApiBearerAuth, ApiTags,
  } from '@nestjs/swagger';
import { AWSStorageDriver } from '../Drivers/aws-driver';
import { GetBucketPipe } from './get-bucket.pipe';
import { GetStorageDriverPipe } from './get-storage-driver.pipe';
import { BucketsProviderService } from './storage.buckets.service';

@ApiTags('bucket')
@Controller('bucket')
export class BucketController {
  constructor(
    private configService: ConfigService,
    private bucketProvider: BucketsProviderService
  ) {}

  @Get('list')
  getBuckets(): any {
    return {
      buckets: this.bucketProvider.findAll()
    }
  }

  @Get('get/:bucket')
  getBucket(@Param('bucket', GetBucketPipe) bucket?: StorageBucket): any {
    return R.omit(['auth'], bucket)
  }

  @Get('status/:bucket')
  getStatus(
    @Param('bucket', GetStorageDriverPipe) storage?: AWSStorageDriver
  ): any {
    return storage.status()
  }

  @Get('browse/:bucket')
  browseRootBucket(@Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver) {
    return this.browseBucket(storage, '/')
  }

  @Get('browse/:bucket/:path')
  async browseBucket(@Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver, @Param('path') path: string) {
    return this.browseBucket2(storage, path)
  }

  @Get('browse/:bucket/:path([^/]+/[^/]+)')
  async browseBucket2(@Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver, @Param('path') path: string) {
    return {
      path: path,
      files: await storage.listObjects(path)
    }
  }
}
