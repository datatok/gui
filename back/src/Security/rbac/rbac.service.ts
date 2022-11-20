import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/config/types';
import { StorageBucket } from 'src/Storage/types';
import { User } from '../users/users.service';
import { RBACRule, RBACRuleResource } from './rbac.types';

@Injectable()
export class RBACService {
  private rules: RBACRule[];

  constructor(private configService?: ConfigService) {
    if (this.configService) {
      const config = this.configService.get<SecurityConfig>('security');

      if (config.rbac.enabled) {
        const configRules = config.rbac.rules;

        // flat map resources --> rule
        this.rules = configRules.flatMap((rule) => {
          return rule.resources.map((resource): RBACRule => {
            return {
              title: rule.title,
              entity: rule.entity,
              verbs: rule.verbs,
              resource: {
                host: resource.host ? new RegExp(resource.host) : null,
                bucket: resource.bucket ? new RegExp(resource.bucket) : null,
                path: resource.path ? new RegExp(resource.path) : null,
              },
            };
          });
        });
      }
    }
  }

  setRules(rules: RBACRule[]): RBACService {
    this.rules = rules;
    return this;
  }

  getRulesForUser(): RBACRule[] {
    return this.rules;
  }

  /**
   * Check if action can be done.
   */
  can(verb: string, user: User, bucket: StorageBucket, path: string): boolean {
    for (const rule of this.rules) {
      if (
        rule.verbs.includes(verb) &&
        this.match(rule.resource, bucket.name, bucket.endpoint?.name, path)
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get all authorized verbs.
   */
  getAuthorizedVerbsForRules(
    rules: RBACRule[],
    bucket: StorageBucket,
    path: string,
  ): string[] {
    const foundRules = rules.filter((rule) => {
      return this.match(
        rule.resource,
        bucket?.name,
        bucket?.endpoint?.hostname,
        path,
      );
    });

    for (const rule of foundRules) {
      console.debug(
        `match(${bucket?.endpoint?.hostname}/${bucket?.name}/${path}) => ${rule.title} with verbs ${rule.verbs}`,
      );
    }

    return foundRules.flatMap((rule) => {
      return rule.verbs;
    });
  }

  /**
   * Test all regex, return false for the 1st no-match
   */
  match(
    resource: RBACRuleResource,
    bucketName: string,
    endpointHost: string,
    path: string,
  ): boolean {
    if (resource.host && !resource.host.test(endpointHost)) {
      return false;
    }

    if (resource.bucket && !resource.bucket.test(bucketName)) {
      return false;
    }

    if (resource.path && !resource.path.test(path)) {
      return false;
    }

    return true;
  }
}
