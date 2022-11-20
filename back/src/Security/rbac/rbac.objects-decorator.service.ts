import { Injectable } from '@nestjs/common';
import { StorageBucket } from '../../Storage/types';
import { RBACService } from './rbac.service';

@Injectable()
export class RBACObjectsDecorator {
  constructor(private rbacService: RBACService) {}

  decorate(bucket: StorageBucket, path: string, files: any[]) {
    const rulesForUser = this.rbacService.getRulesForUser();

    return files.map((file) => {
      file.verbs = this.rbacService.getAuthorizedVerbsForRules(
        rulesForUser,
        bucket,
        path + file.name,
      );

      return file;
    });
  }
}
