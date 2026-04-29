import { Module } from '@nestjs/common';
import { TaskServiceController } from './task-service.controller';
import { TaskServiceService } from './task-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { TaskRepositoryService } from './repositories/task.repository';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>(
          'MONGO_URI',
          'mongodb://localhost:27017/task-workflow-db',
        );

        if (!uri) {
          throw new Error('MONGO_URI is not defined');
        }

        return {
          uri,
        };
      },
    }),
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    NestCacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        stores: [
          createKeyv(
            configService.get<string>('REDIS_URL', 'redis://localhost:6379'),
          ),
        ],
      }),
    }),
  ],
  controllers: [TaskServiceController],
  providers: [TaskServiceService, TaskRepositoryService],
})
export class TaskServiceModule {}
