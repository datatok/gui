import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../../config/configuration';
import { AWSStorageDriver } from '../Drivers/aws-driver';
import { StorageModule } from '../storage.module';
import { StorageService } from '../storage.service';
import { BucketController } from './bucket.controller';
import { BucketsProviderService } from './storage.buckets.service';
import {mockClient} from 'aws-sdk-client-mock';

describe('BucketController', () => {
  let controller: BucketController
  let storageService: StorageService
  let storageDriver: AWSStorageDriver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BucketController],
      imports: [ConfigModule.forRoot({
        load: [configuration],
      })],
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
    mockClient(S3Client).on(ListObjectsCommand).resolvesOnce({
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
      "Marker":"",
      "MaxKeys":1000,
      "Name":"gui",
      "Prefix":""
   })

    const res = await controller.browseRootBucket(storageService.getInstance({
      name: 't'
    }))

    expect(res).toStrictEqual({
      path: "/",
      files: [
        {
          name: "Bucket/",
          type: "folder",
        },
        {
          name: "Security/",
          type: "folder",
        },
        {
          name: "app.controller.spec.ts",
          type: "file",
          editDate: undefined,
          size: 617,
        },
        {
          name: "app.controller.ts",
          type: "file",
          editDate: undefined,
          size: 274,
        },
      ],
    })
  })

  it('should browse nested objects', async () => {
    mockClient(S3Client).on(ListObjectsCommand).resolvesOnce({
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
      "Marker":"",
      "MaxKeys":1000,
      "Name":"gui",
      "Prefix":""
   })

    const res = await controller.browseBucket(storageService.getInstance({
      name: 't'
    }), 'Nested')

    expect(res).toStrictEqual({
      path: "Nested",
      files: [
        {
          name: "Bucket/",
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
