import { Controller, Get, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

import {
    ApiBearerAuth, ApiTags,
  } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('security', 'auth')
@Controller('api/security/auth')
export class SecurityAuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private userService: UsersService
  ) {}

  @Post('anonymous')
  getAnonymous(): any {
    if (this.configService.get<SecurityConfig>("security").auth.anonymous.enabled) {
      return this.authService.login(this.userService.findAnonymous());
    }

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Get('methods')
  getMethods() {
    const methods = []
    const securityConfig = this.configService.get<SecurityConfig>("security")

    if (securityConfig.auth?.anonymous?.enabled) {
      methods.push({
        provider: 'anonymous'
      })
    }

    if (securityConfig.auth?.gitlab?.enabled) {
      methods.push({
        provider: 'gitlab',
        baseURL: securityConfig.auth.gitlab.baseURL
      })
    }

    return methods
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async user(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('local'))
  @Post('loginWithPassword')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
