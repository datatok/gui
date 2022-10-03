import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('connect to S3', async () => {
    const inst = service.getInstance({
      name: 'gui',
      region: 'us-east-1',
      auth: {
        accessKey: 'root',
        secretKey: 'rootroot'
      },
      endpoint: {
        "hostname": "localhost",
        "path": "/",
        "port": 9000,
        "protocol": "http",
      }
    })

    expect(await inst.listObjects("/")).toBeDefined()
  })
});
