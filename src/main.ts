import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

// Load variables from .env (if the file exists) before reading process.env
try {
  process.loadEnvFile();
} catch {
  // .env is optional, defaults are used
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // whitelist: fields that are not declared in a DTO are stripped
  // and never reach the services
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Cinema API')
    .setDescription('Cinema schedule and ticket booking API')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
