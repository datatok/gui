import { createReadStream, createWriteStream, existsSync } from 'fs';
import { promises as fs } from 'fs';
import { basename, join } from 'path';
import { StringUtils } from '../../utils/StringUtils';
import { FileUpload } from '../types';
import { Readable } from 'stream';

export class LocalFSDriver implements StorageDriver {
  public constructor(private rootPath: string) {}

  public async status(): Promise<any> {
    return {
      ok: true,
    };
  }

  public async listObjects(
    key: string,
  ): Promise<
    { name: string; type: string; size?: number; editDate?: string }[]
  > {
    console.trace(`readdir(${this.fixPath(key)})`);
    const keyFullPath = this.fixPath(key);
    const files = await fs.readdir(keyFullPath);

    const files2 = files.map(async (file) => {
      const fileFullPath = join(keyFullPath, file);
      const fileStats = await fs.lstat(fileFullPath);

      return {
        name: basename(file),
        type: fileStats.isDirectory() ? 'folder' : 'file',
        size: fileStats.size,
        editDate: fileStats.ctime.toISOString(),
      };
    });

    return await Promise.all(files2);
  }

  public async createFolder(key: string): Promise<string> {
    const destPath = this.fixPath(key);

    if (existsSync(destPath)) {
      throw new Error('file already exists!');
    }

    return fs.mkdir(destPath, { recursive: true, mode: 755 });
  }

  /**
   * Copy then delete key.
   */
  public async moveKey(key: string, newKey: string): Promise<void> {
    const destPath = this.fixPath(newKey);

    if (existsSync(destPath)) {
      throw new Error('file already exists!');
    }

    return fs.rename(this.fixPath(key), destPath);
  }

  /**
   * Copy key.
   */
  public async copyKey(key: string, newKey: string): Promise<void> {
    const destPath = this.fixPath(newKey);

    if (existsSync(destPath)) {
      throw new Error('file already exists!');
    }

    return fs.copyFile(this.fixPath(key), destPath);
  }

  public async deleteKeys(keys: string[]): Promise<any[]> {
    const promises = keys.map((k: string) => {
      console.trace(`fs.rm(${this.fixPath(k)})`);
      return fs.rm(this.fixPath(k), { recursive: true, force: true });
    });

    return await Promise.all(promises);
  }

  public async uploadObjects(prefix: string, files: FileUpload[]) {
    console.log(files);
    const promises = files.map((file) => {
      const fileFullPath = this.fixPath(join(prefix, file.key));

      if (file.path !== undefined && file.path !== '') {
        fs.rename(file.path, fileFullPath);
      } else {
        const stream = createWriteStream(fileFullPath);

        stream.write(file.buffer);

        stream.end();
      }
    });

    return await Promise.all(promises);
  }

  public async downloadObject(key: string): Promise<Readable> {
    return createReadStream(this.fixPath(key));
  }

  public fixPath(key: string): string {
    return join(this.rootPath, key);
  }

  protected removePrefix(str: string, prefix: string): string {
    if (prefix[0] === '/') {
      return StringUtils.trim(str, '/');
    }

    if (str.startsWith(prefix)) {
      return StringUtils.trim(str.substring(prefix.length), '/');
    }

    return StringUtils.trim(str, '/');
  }
}
