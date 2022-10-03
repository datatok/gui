import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
    ApiBearerAuth, ApiTags,
  } from '@nestjs/swagger';

@ApiTags('security', 'auth')
@Controller('security/auth')
export class SecurityController {
  constructor(private configService: ConfigService) {}

  @Get('anonymous')
  getAnonymous(): any {
    if (this.configService.get<SecurityConfig>("security").auth.anonymous.enabled) {
      return {
        "status": "ok",
        "token": "1234567890"
      }
    }

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
