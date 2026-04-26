import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuthServiceModule } from './auth-service.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.AUTH_SERVICE_PORT || 3001;
  const app = await NestFactory.createMicroservice(AuthServiceModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port,
    },
  });

  await app.listen();
  Logger.log(`Auth Service running on port ${port}`, 'Bootstrap');
}

void bootstrap();
