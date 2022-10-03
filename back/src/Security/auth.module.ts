import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecurityController } from './auth.controller';

@Module({
  controllers: [SecurityController],
  imports: [ConfigModule]
})
export class SecurityModule {}
