import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Support large payloads since email submissions may include raw MIME
  app.use(json({ limit: '25mb' }));
  app.use(urlencoded({ extended: true, limit: '25mb' }));

  // Validate and transform input; allow unknown properties
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // do not strip unknown properties to preserve Proofpoint payload
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.enableShutdownHooks();

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port);

  console.log(`Proofpoint mock listening on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
