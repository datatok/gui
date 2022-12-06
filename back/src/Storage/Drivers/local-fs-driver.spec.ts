import { LocalFSDriver } from './local-fs-driver';
import { tmpdir } from 'os';
import { exec } from 'child_process';
import { join } from 'path';
import * as R from 'ramda';

const FS_ROOT = join(tmpdir(), 'gui');

const getLocalDriver = () => {
  return new LocalFSDriver(FS_ROOT);
};

describe('LocalFSDriver', () => {
  beforeEach(() => {
    exec(`mkdir -p ${FS_ROOT}/nested`);
    exec(`cp ${__dirname}/../../../tests ${FS_ROOT}/`);
    exec(`echo 'hello world' > ${FS_ROOT}/hello.txt`);
    exec(`echo 'hello world' > ${FS_ROOT}/nested/hello.txt`);

    console.log(FS_ROOT);
  });

  afterEach(() => {
    exec(`rm -rf ${FS_ROOT}/*`);
  });

  it('listing objects', async () => {
    const driver = getLocalDriver();

    const results = await driver.listObjects('/');

    expect(
      results.map((r) => {
        return R.pick(['name', 'type'], r);
      }),
    ).toStrictEqual([
      {
        name: 'hello.txt',
        type: 'file',
      },
      {
        name: 'nested',
        type: 'folder',
      },
    ]);
  });

  it('delete objects', async () => {
    const driver = getLocalDriver();

    await driver.deleteKeys(['hello.txt']);

    const results = await driver.listObjects('/');

    expect(results).toHaveLength(1);
  });
});
