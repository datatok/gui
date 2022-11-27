import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './Storage/storage.module';
import configuration, {
  urlGeneratorModuleConfig,
} from './config/configuration';
import { AllExceptionsFilter } from './filters/catch-all.filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SecurityModule } from './Security/security.module';
import { UrlGeneratorModule } from 'nestjs-url-generator';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    StorageModule,
    SecurityModule,
    /*ThrottlerModule.forRoot({
      ttl: 10,
      limit: 500,
    }),*/
    ServeStaticModule.forRoot({
      rootPath: process.env.GUI_PUBLIC_DIR,
      serveStaticOptions: {
        index: false,
      },
    }),
    UrlGeneratorModule.forRootAsync({
      useFactory: () => urlGeneratorModuleConfig(),
    }),
  ],
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
