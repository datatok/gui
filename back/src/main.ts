import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/catch-all.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();

  await app.listen(3001);
}
bootstrap();
