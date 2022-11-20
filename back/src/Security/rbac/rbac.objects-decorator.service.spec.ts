import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageBucket } from 'src/Storage/types';
import configuration from '../../config/configuration';
import { RBACVerbs } from './rbac.const';
import { RBACObjectsDecorator } from './rbac.objects-decorator.service';
import { RBACService } from './rbac.service';
import { RBACRule } from './rbac.types';

describe('RBACDecorator', () => {
  let service: RBACObjectsDecorator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      providers: [RBACService, RBACObjectsDecorator],
    }).compile();

    service = module.get<RBACObjectsDecorator>(RBACObjectsDecorator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should decorate files', () => {
    const bucket: StorageBucket = { name: 'dev-team', title: '' };
    const path = '/';
    const files = [{ key: 'hello.txt' }];

    const decoreatedFiles = service.decorate(bucket, path, files);

    expect(decoreatedFiles[0]).toEqual({
      key: 'hello.txt',
      verbs: ['list', 'read'],
    });
  });
});
