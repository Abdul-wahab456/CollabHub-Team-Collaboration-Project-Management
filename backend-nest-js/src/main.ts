import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Apply exception filter globally
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: 'http://localhost:3000', // your Next.js dev server
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
