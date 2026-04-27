import { Controller } from '@nestjs/common';
import { TaskServiceService } from './task-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTaskDto, UpdateTaskDto } from '@app/common';

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

  @MessagePattern('update-task')
  updateTask(payload: {
    userId: string;
    taskId: string;
    updateTaskDto: UpdateTaskDto;
  }) {
    const { userId, taskId, updateTaskDto } = payload;
    return this.taskServiceService.updateTask(userId, taskId, updateTaskDto);
  }
}
