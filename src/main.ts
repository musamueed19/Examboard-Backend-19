import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://192.168.50.221:8080',
      'http://192.168.50.212:8080',
      'http://localhost:8080',
      'https://examboard17.vercel.app',
    ],
  });

  await app.listen(3000);
}
bootstrap();
