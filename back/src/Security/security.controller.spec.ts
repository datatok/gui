import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../config/configuration';
import { SecurityController } from './auth.controller';
import { SecurityModule } from './auth.module';

describe('SecurityController', () => {
  let appController: SecurityController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SecurityController],
      providers: [],
      imports: [SecurityModule, ConfigModule.forRoot({
        load: [configuration],
      })]
    }).compile();

    appController = app.get<SecurityController>(SecurityController);
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
