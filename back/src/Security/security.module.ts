import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SecurityAuthController } from './auth/auth.controller';
import { AuthObjectsDecorator } from './auth/auth.objects-decorator.service';
import { AuthService } from './auth/auth.service';
import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { RBACObjectsDecorator } from './rbac/rbac.objects-decorator.service';
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
    RBACObjectsDecorator,
    AuthObjectsDecorator,
  ],
  exports: [
    AuthService,
    UsersService,
    RBACObjectsDecorator,
    AuthObjectsDecorator,
  ],
})
export class SecurityModule {}
