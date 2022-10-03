import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecurityModule } from './Security/auth.module';
import { StorageModule } from './Storage/storage.module';
import configuration from './config/configuration';
import { AllExceptionsFilter } from './filters/catch-all.filter';


@Module({
  imports: [SecurityModule, ConfigModule.forRoot({
    load: [configuration],
  }), StorageModule,],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
