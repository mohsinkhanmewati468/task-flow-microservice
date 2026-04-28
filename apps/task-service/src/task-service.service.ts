import { CreateTaskDto, UpdateTaskDto } from '@app/common';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TaskRepositoryService } from './repositories/task.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  RmqOptions,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TaskServiceService {
  private client: ClientProxy;
  constructor(
    private readonly taskRepositoryService: TaskRepositoryService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    const rmqOptions: RmqOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [
          this.configService.get<string>('RABBITMQ_URL') ||
            'amqp://localhost:5672',
        ],
        queue: 'task_event_queue',
        queueOptions: {
          durable: false,
        },
      },
    };
    this.client = ClientProxyFactory.create(rmqOptions);
  }
  private readonly logger = new Logger(TaskServiceService.name);
  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    try {
      const newTask = await this.taskRepositoryService.createTask({
        ...createTaskDto,
        userId,
      });
      if (newTask) {
        this.client.emit('task_created', {
          taskId: newTask._id,
        });
      }
      return {
        success: true,
        data: newTask,
      };
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }
      this.logger.error('Create task error', err);

      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }

  async getTasks(userId: string, page: number, limit: number) {
    try {
      const cacheKey = `tasks:${userId}:${page}:${limit}`;
      const cached = await this.cacheManager.get(cacheKey);
      console.log('CACHE VALUE:', cached);
      if (cached) {
        return {
          success: true,
          data: cached,
          cached: true,
        };
      }
      const tasks = await this.taskRepositoryService.getTasksByUser(
        userId,
        page,
        limit,
      );
      await this.cacheManager.set(cacheKey, tasks, 60);
      return {
        success: true,
        data: tasks,
        cached: false,
      };
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }
      this.logger.error('Create task error', err);

      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }

  async updateTask(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    try {
      const updatedTask = await this.taskRepositoryService.updateTask(
        userId,
        taskId,
        updateTaskDto,
      );
      if (updatedTask?.status === 'completed') {
        this.client.emit('task_completed', {
          taskId: updatedTask._id,
        });
      }
      return {
        success: true,
        data: updatedTask,
      };
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }
      this.logger.error('Create task error', err);

      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }
}
