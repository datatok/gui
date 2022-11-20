import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../../config/configuration';
import { UsersService } from '../users/users.service';
import { SecurityAuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';

describe('SecurityController', () => {
  let appController: SecurityAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SecurityAuthController],
      providers: [AuthService, UsersService],
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
    }).compile();

    appController = app.get<SecurityAuthController>(SecurityAuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const data = await appController.getAnonymous();

      expect(data.access_token).toBeDefined();
    });
  });
});
