import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common';
import { BucketsProviderService } from './storage.buckets.service';

@Injectable()
export class GetBucketPipe implements PipeTransform {

  constructor(
    private bucketsProviderService: BucketsProviderService
  ) {}

  transform(value: any, metadata: ArgumentMetadata): StorageBucket | undefined {
    const bucket = this.bucketsProviderService.findByID(value);

    if (bucket) {
      return bucket
    }

    throw new NotFoundException('bucket not found!')
  }
}