import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../../config/configuration';
import { RBACVerbs } from './rbac.const';
import { RBACService } from './rbac.service';
import { RBACRule } from './rbac.types';

describe('RBACService', () => {
  let service: RBACService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      providers: [RBACService],
    }).compile();

    service = module.get<RBACService>(RBACService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should match rules', async () => {
    expect(service.match({}, 'hello', 'localhost', '/')).toEqual(true);

    expect(
      // eslint-disable-next-line prettier/prettier
      service.match(
        { bucket: new RegExp('.*') },
        'hello',
        'localhost',
        '/',
      ),
    ).toEqual(true);

    expect(
      service.match(
        { bucket: new RegExp('.*'), host: new RegExp('.*') },
        'hello',
        'localhost',
        '/',
      ),
    ).toEqual(true);

    expect(
      service.match(
        { bucket: new RegExp('^dev-(.*)$') },
        'dev-team',
        'localhost',
        '/',
      ),
    ).toEqual(true);

    expect(
      service.match(
        { bucket: new RegExp('^dev-(.*)$') },
        'prod-team',
        'localhost',
        '/',
      ),
    ).toEqual(false);

    expect(
      service.match(
        { bucket: new RegExp('^dev-(.*)$'), host: new RegExp('localhost') },
        'dev-team',
        'staging',
        '/',
      ),
    ).toEqual(false);

    expect(
      service.match(
        { bucket: new RegExp('^dev-(.*)$'), host: new RegExp('localhost') },
        'dev-team',
        'localhost',
        '/',
      ),
    ).toEqual(true);
  });

  it('should match rules with path', async () => {
    expect(service.match({}, 'hello', 'localhost', '/')).toEqual(true);

    expect(
      service.match(
        { bucket: new RegExp('^dev-(.*)$'), path: new RegExp('Admin(.*)') },
        'dev-team',
        'staging',
        '/Bucket',
      ),
    ).toEqual(false);

    expect(
      service.match(
        { bucket: new RegExp('^dev-(.*)$'), path: new RegExp('^/Bucket(.*)$') },
        'dev-team',
        'localhost',
        '/Bucket/Admin/toto.txt',
      ),
    ).toEqual(true);

    expect(
      service.match(
        { bucket: new RegExp('^dev-(.*)$'), path: new RegExp('^/Bucket(.*)$') },
        'dev-team',
        'localhost',
        '/Root/Bucket/Admin/toto.txt',
      ),
    ).toEqual(false);
  });

  it('should generate verbs', async () => {
    const dataset = [
      {
        title: 'Empty',
        rules: [],
        bucket: '',
        expected: [],
      },
      {
        title: 'Verbs should match all',
        rules: [{ verbs: [RBACVerbs.List, RBACVerbs.Download], resource: {} }],
        bucket: '',
        expected: [RBACVerbs.List, RBACVerbs.Download],
      },
      {
        title: 'shoud not match dev buckets',
        rules: [
          {
            verbs: [RBACVerbs.Edit, RBACVerbs.Delete],
            resource: { bucket: new RegExp('dev-(.*)') },
          },
          {
            verbs: [RBACVerbs.List, RBACVerbs.Download],
            resource: { bucket: new RegExp('(.*)') },
          },
        ],
        bucket: 'prod-team',
        expected: [RBACVerbs.List, RBACVerbs.Download],
      },
      {
        title: 'should match all rules',
        rules: [
          {
            verbs: [RBACVerbs.Edit, RBACVerbs.Delete],
            resource: { bucket: new RegExp('prod-(.*)') },
          },
          {
            verbs: [RBACVerbs.Download],
            resource: { bucket: new RegExp('(.*)-team') },
          },
          {
            verbs: [RBACVerbs.List],
            resource: {},
          },
        ],
        bucket: 'prod-team',
        expected: [
          RBACVerbs.Edit,
          RBACVerbs.Delete,
          RBACVerbs.Download,
          RBACVerbs.List,
        ],
      },
      {
        title: 'should match all rules',
        rules: [
          {
            verbs: [RBACVerbs.Edit, RBACVerbs.Delete],
            resource: { bucket: new RegExp('prod-(.*)') },
          },
          {
            verbs: [RBACVerbs.Download],
            resource: { bucket: new RegExp('(.*)-team') },
          },
          {
            verbs: [RBACVerbs.List],
            resource: { host: new RegExp('staging') },
          },
        ],
        bucket: 'prod-team',
        hostname: 'staging',
        expected: [
          RBACVerbs.Edit,
          RBACVerbs.Delete,
          RBACVerbs.Download,
          RBACVerbs.List,
        ],
      },
      {
        title: 'should match all rules except hostname',
        rules: [
          {
            verbs: [RBACVerbs.Edit, RBACVerbs.Delete],
            resource: { bucket: new RegExp('prod-(.*)') },
          },
          {
            verbs: [RBACVerbs.Download],
            resource: { bucket: new RegExp('(.*)-team') },
          },
          {
            verbs: [RBACVerbs.List],
            resource: { host: new RegExp('staging') },
          },
        ],
        bucket: 'prod-team',
        hostname: 'localhost',
        expected: [RBACVerbs.Edit, RBACVerbs.Delete, RBACVerbs.Download],
      },
      {
        title: 'should not be able to upload',
        rules: [
          {
            verbs: [RBACVerbs.List, RBACVerbs.Download],
            resource: { bucket: new RegExp('(.*)') },
          },
          {
            verbs: [RBACVerbs.Upload],
            resource: {
              bucket: new RegExp('(.*)'),
              path: new RegExp('^/Bucket(.*)$'),
            },
          },
        ],
        bucket: 'prod-team',
        hostname: 'localhost',
        path: '/Toto',
        expected: [RBACVerbs.List, RBACVerbs.Download],
      },
      {
        title: 'should not be able to upload',
        rules: [
          {
            verbs: [RBACVerbs.List, RBACVerbs.Download],
            resource: { bucket: new RegExp('(.*)') },
          },
          {
            verbs: [RBACVerbs.Upload],
            resource: {
              bucket: new RegExp('(.*)'),
              path: new RegExp('^/Bucket(.*)$'),
            },
          },
        ],
        bucket: 'prod-team',
        hostname: 'localhost',
        path: '',
        expected: [RBACVerbs.List, RBACVerbs.Download],
      },
      {
        title: 'should be able to upload',
        rules: [
          {
            verbs: [RBACVerbs.List, RBACVerbs.Download],
            resource: { bucket: new RegExp('(.*)') },
          },
          {
            verbs: [RBACVerbs.Upload],
            resource: {
              bucket: new RegExp('(.*)'),
              path: new RegExp('^/Bucket(.*)$'),
            },
          },
        ],
        bucket: 'prod-team',
        hostname: 'localhost',
        path: '/Bucket',
        expected: [RBACVerbs.List, RBACVerbs.Download, RBACVerbs.Upload],
      },
    ];

    for (const data of dataset) {
      expect(
        service.getAuthorizedVerbsForRules(
          data.rules.map((r): RBACRule => {
            return {
              ...r,
              entity: { kind: '', name: '' },
            };
          }),
          {
            name: data.bucket,
            title: '',
            endpoint: { hostname: data.hostname, protocol: 'http', path: '' },
          },
          data.path || '',
        ),
      ).toEqual(data.expected);
    }
  });
});
