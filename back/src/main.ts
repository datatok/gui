import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('GUI')
    .setDescription('Yet another UI for S3')
    .setVersion('1.0')
    .addTag('gui')
    .addBearerAuth(
      {
        name: 'access_token',
        bearerFormat: 'JWT',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
      },
      'access_token',
    )
    .build();

  app.set('trust proxy', 1);

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/console', app, document);

  app.enableCors({
    methods: ['GET'],
  });
  //app.use(csurf());

  await app.listen(process.env.GUI_PORT || 3001);
}

bootstrap();
