import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  if (process.env.GUI_PUBLIC_DIR === undefined) {
    console.error('You must define env var GUI_PUBLIC_DIR');
    process.exit(1);
  }

  if (process.env.GUI_CONFIG_FILE === undefined) {
    console.error('You must define env var GUI_CONFIG_FILE');
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    methods: ['GET'],
  });
  //app.use(csurf());

  await app.listen(process.env.GUI_PORT || 3001);
}

bootstrap();
