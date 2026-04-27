import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateTaskDto,
  LoginDto,
  RegisterDto,
  UpdateTaskDto,
} from '@app/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { firstValueFrom } from 'rxjs';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './common/decorators/roles.decorator';
import { User } from './common/decorators/user.decorator';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('TASK_SERVICE') private taskClient: ClientProxy,
  ) {}
  @Post('register')
  register(@Body() body: RegisterDto) {
    return firstValueFrom(this.authClient.send('register', body));
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return firstValueFrom(this.authClient.send('login', body));
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Post('tasks/create-task')
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @User('userId') userId: string,
  ) {
    console.log('userId', userId);
    const payload = { ...createTaskDto, userId };
    return firstValueFrom(this.taskClient.send('create-task', payload));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get('tasks/get-tasks')
  getTasks(
    @User('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return firstValueFrom(
      this.taskClient.send('get-tasks', { userId, page, limit }),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Patch('tasks/update-task/:taskId')
  updateTask(
    @User('userId') userId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return firstValueFrom(
      this.taskClient.send('update-task', { userId, taskId, updateTaskDto }),
    );
  }
}
