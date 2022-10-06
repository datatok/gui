import { Controller, Get, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

import {
    ApiBearerAuth, ApiTags,
  } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@ApiTags('security', 'auth')
@Controller('security/auth')
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

  @UseGuards(AuthGuard('local'))
  @Post('loginWithPassword')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
