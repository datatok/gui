import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as csurf from 'csurf';
import { AllExceptionsFilter } from './filters/catch-all.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    methods: ['GET', 'POST']
  });
  //app.use(csurf());

  await app.listen(3001);
}
bootstrap();
