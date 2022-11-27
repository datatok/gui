import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { BucketDownloadController } from 'src/Storage/Buckets/download.controller';
import { StorageBucket } from 'src/Storage/types';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly urlGeneratorService: UrlGeneratorService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '2 days',
        secret: jwtConstants.secret,
      }),
      username: user.username,
    };
  }

  /**
   * Secure a single URL
   */
  secureLink(bucket: StorageBucket, key: string): string {
    return this.urlGeneratorService.signControllerUrl({
      controller: BucketDownloadController,
      controllerMethod: BucketDownloadController.prototype.downloadKey,
      params: {
        bucket: bucket.id,
      },
      query: {
        key,
      },
      expirationDate: dayjs().add(30, 'minute').toDate(),
    });
  }
}
