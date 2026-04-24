import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from '@app/common';

@Controller()
export class ApiGatewayController {
  constructor(
    private readonly apiGatewayService: ApiGatewayService,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
  ) {}

  @Get()
  test() {
    return this.authClient.send('ping', {});
  }
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authClient.send('register', body);
  }
}
