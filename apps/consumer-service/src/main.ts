import { NestFactory } from '@nestjs/core';
import { ConsumerServiceModule } from './consumer-service.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ConsumerServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'task_event_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen();
  Logger.log('Consumer service is running');
}
void bootstrap();
