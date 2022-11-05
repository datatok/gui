import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  NotFoundException,
} from '@nestjs/common';
import { StorageBucket } from '../types';
import { BucketsProviderService } from './storage.buckets.service';

@Injectable()
export class GetBucketPipe implements PipeTransform {
  constructor(private bucketsProviderService: BucketsProviderService) {}

  transform(value: any): StorageBucket | undefined {
    const bucket = this.bucketsProviderService.findByID(value);

    if (bucket) {
      return bucket;
    }

    throw new NotFoundException('bucket not found!');
  }
}
