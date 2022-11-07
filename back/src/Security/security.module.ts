import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SecurityAuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { RBACService } from './rbac/rbac.service';
import { UsersService } from './users/users.service';

@Module({
  controllers: [SecurityAuthController],
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    UsersService,
    RBACService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [UsersService, RBACService],
})
export class SecurityModule {}
