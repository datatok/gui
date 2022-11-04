import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './Storage/storage.module';
import configuration from './config/configuration';
import { AllExceptionsFilter } from './filters/catch-all.filter';
import { AuthModule } from './Security/auth/auth.module';
import { UsersModule } from './Security/users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    StorageModule,
    AuthModule,
    UsersModule,
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
