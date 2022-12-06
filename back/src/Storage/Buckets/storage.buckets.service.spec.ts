import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../../config/configuration';
import { BucketsProviderService } from './storage.buckets.service';

describe('StorageBucketsService', () => {
  let service: BucketsProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BucketsProviderService],
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
    }).compile();

    service = module.get<BucketsProviderService>(BucketsProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a bucket', () => {
    expect(service.findByID('local-gui')).toBeDefined();
  });

  it('should find a local-fs bucket', () => {
    expect(service.findByID('local-fs')).toBeDefined();
    expect(service.findByID('local-fs').path).toStrictEqual('.');
  });
});
