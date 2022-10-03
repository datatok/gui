import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BucketController } from './Buckets/bucket.controller';
import { BucketsProviderService } from './Buckets/storage.buckets.service';
import { StorageService } from './storage.service';

@Module({
  controllers: [BucketController],
  providers: [StorageService, BucketsProviderService],
  imports: [ConfigModule]
})
export class StorageModule {}
