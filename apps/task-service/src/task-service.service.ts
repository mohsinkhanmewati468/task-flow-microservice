import { CreateTaskDto } from '@app/common';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TaskRepositoryService } from './repositories/task.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class TaskServiceService {
  constructor(
    private readonly taskRepositoryService: TaskRepositoryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private readonly logger = new Logger(TaskServiceService.name);
  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    try {
      const newTask = await this.taskRepositoryService.createTask({
        ...createTaskDto,
        userId,
      });
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
}
