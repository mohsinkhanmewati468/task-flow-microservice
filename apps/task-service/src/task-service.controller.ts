import { Controller, Get } from '@nestjs/common';
import { TaskServiceService } from './task-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class TaskServiceController {
  constructor(private readonly taskServiceService: TaskServiceService) {}

  @MessagePattern('ping_task')
  ping() {
    return { message: 'Task service working' };
  }
}
