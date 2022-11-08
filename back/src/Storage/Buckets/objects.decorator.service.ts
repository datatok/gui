import { Injectable } from '@nestjs/common';
import { AuthObjectsDecorator } from '../../Security/auth/auth.objects-decorator.service';
import { RBACObjectsDecorator } from '../../Security/rbac/rbac.objects-decorator.service';
import { StorageBucket } from '../types';

@Injectable()
export class ObjectsDecorator {
  constructor(
    private rbacDecorator: RBACObjectsDecorator,
    private authDownloadLinkDecorator: AuthObjectsDecorator,
  ) {}

  decorate(bucket: StorageBucket, path: string, files: any[]) {
    return this.authDownloadLinkDecorator.decorate(
      bucket,
      path,
      this.rbacDecorator.decorate(bucket, path, files),
    );
  }
}
