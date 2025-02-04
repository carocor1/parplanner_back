import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.setGlobalPrefix('parplanner');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  NestFactory.create(AppModule);

  await app.listen(3000);
}
bootstrap();
