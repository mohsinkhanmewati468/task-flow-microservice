import { Controller } from '@nestjs/common';
import { ConsumerServiceService } from './consumer-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class ConsumerServiceController {
  constructor(
    private readonly consumerServiceService: ConsumerServiceService,
  ) {}

  @EventPattern('task_created')
  handleTaskCreated(@Payload() data: any) {
    console.log('Task created EVENT RECEIVED:', data);
  }

  @EventPattern('task_completed')
  handleTaskCompleted(@Payload() data: any) {
    console.log('Task completed EVENT RECEIVED:', data);
  }
}
