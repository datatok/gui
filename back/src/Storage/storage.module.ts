import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecurityModule } from 'src/Security/security.module';
import { BucketController } from './Buckets/bucket.controller';
import { BucketDownloadController } from './Buckets/download.controller';
import { ObjectsDecorator } from './Buckets/objects.decorator.service';
import { BucketsProviderService } from './Buckets/storage.buckets.service';
import { StorageService } from './storage.service';

@Module({
  controllers: [BucketController, BucketDownloadController],
  providers: [StorageService, BucketsProviderService, ObjectsDecorator],
  imports: [ConfigModule, SecurityModule],
})
export class StorageModule {}
