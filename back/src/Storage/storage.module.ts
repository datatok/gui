import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/Security/auth/auth.service';
import { SecurityModule } from 'src/Security/security.module';
import { UsersService } from 'src/Security/users/users.service';
import { BucketController } from './Buckets/bucket.controller';
import { BucketDownloadController } from './Buckets/download.controller';
import { BucketsProviderService } from './Buckets/storage.buckets.service';
import { StorageService } from './storage.service';

@Module({
  controllers: [BucketController, BucketDownloadController],
  providers: [
    StorageService,
    BucketsProviderService,
    AuthService,
    UsersService,
    JwtService,
  ],
  imports: [ConfigModule, SecurityModule],
})
export class StorageModule {}
