import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from '@app/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ApiGatewayController {
  constructor(
    private readonly apiGatewayService: ApiGatewayService,
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

  @UseGuards(JwtAuthGuard)
  @Get('task/ping')
  pingTask() {
    return firstValueFrom(this.taskClient.send('ping_task', {}));
  }
}
