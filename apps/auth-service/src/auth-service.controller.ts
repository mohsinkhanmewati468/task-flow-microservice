import { Controller } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from '@app/common';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}
  @MessagePattern('register')
  register(@Payload() registerDto: RegisterDto) {
    return this.authServiceService.register(registerDto);
  }

  @MessagePattern('login')
  login(@Payload() loginDto: LoginDto) {
    return this.authServiceService.login(loginDto);
  }

  @MessagePattern('ping')
  ping() {
    return 'Auth Service is alive';
  }
}
