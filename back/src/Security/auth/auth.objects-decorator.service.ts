import { Injectable } from '@nestjs/common';
import { StorageBucket } from '../../Storage/types';
import { AuthService } from './auth.service';

@Injectable()
export class AuthObjectsDecorator {
  constructor(private authService: AuthService) {}

  decorate(bucket: StorageBucket, path: string, files: any[]) {
    return files.map((file) => {
      if (file.type === 'file') {
        return {
          ...file,
          downloadLink: this.authService.secureLink(bucket, path + file.name),
        };
      }

      return file;
    });
  }
}
