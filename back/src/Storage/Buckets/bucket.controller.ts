import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import * as R from 'ramda'

import {
    ApiBearerAuth, ApiTags,
  } from '@nestjs/swagger';
import { AWSStorageDriver } from '../Drivers/aws-driver';
import { GetBucketPipe } from './get-bucket.pipe';
import { GetStorageDriverPipe } from './get-storage-driver.pipe';
import { BucketsProviderService } from './storage.buckets.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { DeleteKeysDto } from './dto/delete-keys.dto';
import { JwtAuthGuard } from 'src/Security/auth/jwt-auth.guard';

@ApiTags('bucket')
@ApiBearerAuth('access_token')
@Controller('bucket')
@UseGuards(JwtAuthGuard)
export class BucketController {
  constructor(
    private bucketProvider: BucketsProviderService
  ) {}

  @Get()
  getBuckets(): any {
    return {
      buckets: this.bucketProvider.findAll().map(bucket => {
        return R.omit(['auth'], bucket)
      })
    }
  }

  @Get(':bucket')
  getBucket(@Param('bucket', GetBucketPipe) bucket?: StorageBucket): any {
    return R.omit(['auth'], bucket)
  }

  @Get(':bucket/status')
  getStatus(
    @Param('bucket', GetStorageDriverPipe) storage?: AWSStorageDriver
  ): any {
    return storage.status()
  }

  @Get(':bucket/browse')
  async browseRootBucket(
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver
  ) {
    return this.browseBucket(storage, '')
  }

  @Get(':bucket/browse/:path')
  async browseBucket(
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver, 
    @Param('path') path: string
  ) {
    return this.browseBucket2(storage, path)
  }

  @Get(':bucket/browse/:path([^/]+/[^/]+)')
  async browseBucket2(
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver,
    @Param('path') path: string
  ) {
    path += '/'
    
    return {
      prefix: path,
      files: await storage.listObjects(path)
    }
  }

  @Post(':bucket/key/create')
  async createKey(
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver,
    @Body() createFolderDto: CreateFolderDto
  ) {
    return await storage.createFolder(createFolderDto.path)
  }

  @Post(':bucket/key/delete')
  async deleteKeys(
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver,
    @Body() deleteKeys: DeleteKeysDto
  ) {
    return await storage.deleteKeys(deleteKeys.keys)
  }

}
