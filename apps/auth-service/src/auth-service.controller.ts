import { Controller } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterDto } from '@app/common';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}
  @MessagePattern('register')
  register(@Payload() data: RegisterDto) {
    const user = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
    };

    return {
      message: 'User registered',
      user,
    };
  }

  @MessagePattern('ping')
  ping() {
    return 'Auth Service is alive';
  }
}
