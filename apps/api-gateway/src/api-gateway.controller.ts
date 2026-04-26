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

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authClient.send('login', body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
