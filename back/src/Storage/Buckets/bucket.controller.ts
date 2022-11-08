import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import * as R from 'ramda';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AWSStorageDriver } from '../Drivers/aws-driver';
import { GetBucketPipe } from './get-bucket.pipe';
import { GetStorageDriverPipe } from './get-storage-driver.pipe';
import { BucketsProviderService } from './storage.buckets.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { DeleteKeysDto } from './dto/delete-keys.dto';
import { JwtAuthGuard } from '../../Security/auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadObjectsDto } from './dto/upload-objects.dto';
import { BrowseDto } from './dto/browse.dto';
import { EditKeyDTO } from './dto/edit-key.dto';
import { FileUpload, StorageBucket } from '../types';
import { AuthService } from 'src/Security/auth/auth.service';
import { ObjectsDecorator } from './objects.decorator.service';
import { AuthCurrentUser } from 'src/Security/auth/auth.user.param-decorator';

@ApiTags('bucket')
@ApiBearerAuth('access_token')
@Controller('api/bucket')
@UseGuards(JwtAuthGuard)
export class BucketController {
  constructor(
    private bucketProvider: BucketsProviderService,
    private objectsDecorator: ObjectsDecorator,
    private authService: AuthService,
  ) {}

  @Get()
  getBuckets(): any {
    return {
      buckets: this.bucketProvider.findAll().map((bucket) => {
        return R.omit(['auth'], bucket);
      }),
    };
  }

  @Get(':bucket')
  @ApiParam({
    name: 'bucket',
    required: true,
    description: 'name of bucket',
    schema: { oneOf: [{ type: 'string' }] },
    type: 'string',
    example: 'local-gui',
  })
  getBucket(@Param('bucket', GetBucketPipe) bucket?: StorageBucket): any {
    return R.omit(['auth'], bucket);
  }

  @Get(':bucket/status')
  @ApiParam({
    name: 'bucket',
    required: true,
    description: 'name of bucket',
    schema: { oneOf: [{ type: 'string' }] },
    type: 'string',
    example: 'local-gui',
  })
  getStatus(
    @Param('bucket', GetStorageDriverPipe) storage?: AWSStorageDriver,
  ): any {
    return storage.status();
  }

  @Get(':bucket/browse')
  @ApiOperation({ summary: 'List bucket objects' })
  @ApiParam({
    name: 'bucket',
    required: true,
    description: 'name of bucket',
    schema: { oneOf: [{ type: 'string' }] },
    type: 'string',
    example: 'local-gui',
  })
  @ApiQuery({
    name: 'path',
    required: true,
    example: '/',
  })
  async browse(
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver,
    @Param('bucket', GetBucketPipe) bucket: StorageBucket,
    @AuthCurrentUser() authUser,
    @Query(
      new ValidationPipe({
        transform: false,
        forbidNonWhitelisted: true,
      }),
    )
    query: BrowseDto,
  ) {
    let path = query.path || '';

    if (path !== '' && path !== '/') {
      path += '/';
    }

    console.log(authUser);

    const files = await storage.listObjects(path);

    const filesDecorated = this.objectsDecorator.decorate(bucket, path, files);

    return {
      prefix: path,
      files: filesDecorated,
    };
  }

  @Post(':bucket/key/create')
  async createKey(
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver,
    @Body() createFolderDto: CreateFolderDto,
  ) {
    return await storage.createFolder(createFolderDto.path);
  }

  @Post(':bucket/key/delete')
  @ApiParam({
    name: 'bucket',
    required: true,
    description: 'name of bucket',
    schema: { oneOf: [{ type: 'string' }] },
    type: 'string',
    example: 'local-gui',
  })
  async deleteKeys(
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver,
    @Body() deleteKeys: DeleteKeysDto,
  ) {
    return await storage.deleteKeys(deleteKeys.keys);
  }

  @Post(':bucket/key/move')
  @ApiParam({
    name: 'bucket',
    required: true,
    description: 'name of bucket',
    schema: { oneOf: [{ type: 'string' }] },
    type: 'string',
    example: 'local-gui',
  })
  async renameKey(
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver,
    @Body() editKey: EditKeyDTO,
  ) {
    return await storage.moveKey(editKey.sourceKey, editKey.targetKey);
  }

  @Post(':bucket/key/copy')
  @ApiParam({
    name: 'bucket',
    required: true,
    description: 'name of bucket',
    schema: { oneOf: [{ type: 'string' }] },
    type: 'string',
    example: 'local-gui',
  })
  async copyKey(
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver,
    @Body() editKey: EditKeyDTO,
  ) {
    return await storage.copyKey(editKey.sourceKey, editKey.targetKey);
  }

  @Post(':bucket/upload')
  @ApiParam({
    name: 'bucket',
    required: true,
    description: 'name of bucket',
    schema: { oneOf: [{ type: 'string' }] },
    type: 'string',
    example: 'local-gui',
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadObjects(
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() uploadObjects: UploadObjectsDto,
  ) {
    if (files) {
      const files2: FileUpload[] = files.map((file) => {
        return {
          key: Buffer.from(file.originalname, 'latin1').toString('utf8'),
          contentType: file.mimetype,
          contentSize: file.size,
          buffer: file.buffer,
        };
      });

      return storage.uploadObjects(uploadObjects.path, files2);
    }

    return [];
  }
}
