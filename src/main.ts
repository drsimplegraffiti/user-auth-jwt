import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const port = process.env.PORT || 3003;
  const host = process.env.HOST || '127.0.0.1';
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  await app.listen(port, host, () => {
    Logger.log(`Application listening on port ${port}`, 'Bootstrap');
  });
}
bootstrap();
