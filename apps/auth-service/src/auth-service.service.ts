import { LoginDto, RegisterDto } from '@app/common';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import bcrypt from 'bcryptjs';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthServiceService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthServiceService.name);

  getHello(): string {
    return 'Hello World!';
  }
  async hashPassword(password: string): Promise<string> {
    const SALT_ROUNDS = 10;
    return bcrypt.hash(password, SALT_ROUNDS);
  }
  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
  signToken(payload: { sub: string; role: string }) {
    return this.jwtService.signAsync(payload, { expiresIn: '1h' });
  }

  async register(registerDto: RegisterDto) {
    try {
      const { name, email, password } = registerDto;
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User already exists',
        });
      }
      const hashedPassword = await this.hashPassword(password);
      const user = await this.userRepository.createUser({
        name,
        email,
        password: hashedPassword,
      });
      return {
        success: true,
        data: {
          _id: user._id,
          name,
          email,
        },
      };
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }
      this.logger.error('Register error', err);

      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const email: string = loginDto.email;
      const password: string = loginDto.password;
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new RpcException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
        });
      }
      const isPasswordMatch = await this.verifyPassword(
        password,
        user.password,
      );
      if (!isPasswordMatch) {
        throw new RpcException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
        });
      }
      const payload = { sub: user._id.toString(), role: 'user' };
      const accessToken: string = await this.signToken(payload);
      return {
        success: true,
        data: {
          user: {
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
          },
          accessToken,
        },
      };
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }
      this.logger.error('Login error', err);

      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }
}
