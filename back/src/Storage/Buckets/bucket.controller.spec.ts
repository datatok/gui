import { ListObjectsCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../../config/configuration';
import { AWSStorageDriver } from '../Drivers/aws-driver';
import { StorageService } from '../storage.service';
import { BucketController } from './bucket.controller';
import { BucketsProviderService } from './storage.buckets.service';
import {mockClient} from 'aws-sdk-client-mock';
import { BrowseDto } from './dto/browse.dto';
import { AuthModule } from '../../Security/auth/auth.module';
import { UsersModule } from '../../Security/users/users.module';
import * as R from 'ramda'

describe('BucketController', () => {
  let controller: BucketController
  let storageService: StorageService
  let storageDriver: AWSStorageDriver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BucketController],
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        AuthModule,
        UsersModule,
      ],
      providers: [
        BucketsProviderService,
        StorageService,
      ]
    }).compile();

    controller = module.get<BucketController>(BucketController);
    storageService = module.get<StorageService>(StorageService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should not display secretKey', () => {
    const res = controller.getBucket({
      name: 't',
      auth: {
        name: 'a',
        accessKey: 'accessKey',
        secretKey: 'secretKey'
      }
    })

    expect(res.auth).toBeUndefined()
    expect(res.name).toStrictEqual('t')
  })

  it('should browse root objects', async () => {
    mockClient(S3Client).on(ListObjectsV2Command).resolvesOnce({
      "$metadata":{
      },
      "CommonPrefixes":[
         {
            "Prefix":"Bucket/"
         },
         {
            "Prefix":"Security/"
         }
      ],
      "Contents":[
         {
            "Key":"app.controller.spec.ts",
            "Size":617,
            "StorageClass":"STANDARD"
         },
         {
            "Key":"app.controller.ts",
            "Size":274,
            "StorageClass":"STANDARD"
         }
      ],
      "Delimiter":"/",
      "IsTruncated":false,
      "MaxKeys":1000,
      "Name":"gui",
      "Prefix":""
   })

   const rootQuery = new BrowseDto()

   rootQuery.path = '/'

    const res = await controller.browse(storageService.getInstance({
      name: 't'
    }), rootQuery)

    const files = res.files.map(f => R.pick(['name', 'type'], f))

    expect(files).toStrictEqual([
      {
        name: "Bucket",
        type: "folder",
      },
      {
        name: "Security",
        type: "folder",
      },
      {
        name: "app.controller.spec.ts",
        type: "file",
      },
      {
        name: "app.controller.ts",
        type: "file",
      },
    ])
  })

  it('should browse nested objects', async () => {
    mockClient(S3Client).on(ListObjectsV2Command).resolvesOnce({
      "$metadata":{
      },
      "CommonPrefixes":[
         {
            "Prefix":"Nested/Bucket/"
         }
      ],
      "Contents":[
         {
            "Key":"Nested/app.controller.spec.ts",
            "Size":617,
            "StorageClass":"STANDARD"
         }
      ],
      "Delimiter":"/",
      "IsTruncated":false,
      "MaxKeys":1000,
      "Name":"gui",
      "Prefix":""
   })

   const pathQuery = new BrowseDto()

   pathQuery.path = 'Nested'

    const res = await controller.browse(storageService.getInstance({
      name: 't'
    }), pathQuery)

    expect(res).toStrictEqual({
      prefix: "Nested/",
      files: [
        {
          name: "Bucket",
          type: "folder",
        },
        {
          name: "app.controller.spec.ts",
          editDate: undefined,
          type: "file",
          size: 617,
        },
      ],
    })
  })
});
