import { Body, Controller, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
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
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadObjectsDto } from './dto/upload-objects.dto';
import { BrowseDto } from './dto/browse.dto';

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
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver,
    @Query(new ValidationPipe({
      transform: false,
      forbidNonWhitelisted: true
  })) query: BrowseDto
  ) {
    let path = query.path

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

  @Post(':bucket/upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadObjects(
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() uploadObjects: UploadObjectsDto
  ) {
    console.log(files)
    const files2:FileUpload[] = files.map(file => {
      return {
        key: file.originalname,
        contentType: file.mimetype,
        contentSize: file.size,
        buffer: file.buffer
      }
    })

    return storage.uploadObjects(uploadObjects.path, files2)
  }

}
