import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import helmet from 'helmet';
import { SanitizePipe } from './common/pipes/sanitize.pipe';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_GATEWAY_PORT') || 3000;
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  app.use(
    helmet({
      contentSecurityPolicy: false, // disable in dev (can break frontend)
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
    new SanitizePipe(),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(port);
  Logger.log(`API Gateway running on port ${port}`, 'Bootstrap');
}
void bootstrap();
