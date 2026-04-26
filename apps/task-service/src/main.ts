import { NestFactory } from '@nestjs/core';
import { TaskServiceModule } from './task-service.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const port = Number(process.env.TASK_SERVICE_PORT) || 3002;
  const app = await NestFactory.createMicroservice(TaskServiceModule, {
    transport: Transport.TCP,
    options: {
      port,
      host: '127.0.0.1',
    },
  });
  await app.listen();
  Logger.log(`Task Service running on port ${port}`, 'Bootstrap');
}
void bootstrap();
