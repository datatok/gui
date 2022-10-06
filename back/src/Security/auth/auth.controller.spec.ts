import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../../config/configuration';
import { SecurityAuthController } from './auth.controller';
import { AuthModule } from './auth.module';

describe('SecurityController', () => {
  let appController: SecurityAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SecurityAuthController],
      providers: [],
      imports: [AuthModule, ConfigModule.forRoot({
        load: [configuration],
      })]
    }).compile();

    appController = app.get<SecurityAuthController>(SecurityAuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getAnonymous()).toStrictEqual({
        "status": "ok",
        "token": "1234567890"
      })
    });
  });
});
