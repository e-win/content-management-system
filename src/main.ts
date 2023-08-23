import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = 3000;

  const app = await NestFactory.create(AppModule);
  initSwagger(app);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
  Logger.log(`Application start at ${PORT}`);
}

async function initSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Content management system')
    .setDescription('Content management system description')
    .setVersion('1.0')
    .addTag('Content management system')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap();
