import { Controller } from '@nestjs/common';
import { TaskServiceService } from './task-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTaskDto } from '@app/common';

@Controller()
export class TaskServiceController {
  constructor(private readonly taskServiceService: TaskServiceService) {}

  @MessagePattern('create-task')
  createTask(@Payload() payload: CreateTaskDto & { userId: string }) {
    const { userId, ...createTaskDto } = payload;
    return this.taskServiceService.createTask(createTaskDto, userId);
  }

  @MessagePattern('get-tasks')
  getTasks({
    userId,
    page,
    limit,
  }: {
    userId: string;
    page: number;
    limit: number;
  }) {
    return this.taskServiceService.getTasks(userId, page, limit);
  }
}
