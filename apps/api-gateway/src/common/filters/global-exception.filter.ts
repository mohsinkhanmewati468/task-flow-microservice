import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // ✅ Handle HttpException FIRST
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      let message: string;

      if (typeof res === 'string') {
        message = res;
      } else if (Array.isArray((res as any).message)) {
        message = (res as any).message[0];
      } else {
        message = (res as any).message || 'Error';
      }

      // 🔥 Log only server errors
      if (status >= 500) {
        this.logger.error('HTTP Exception', exception.stack);
      }

      return response.status(status).json({
        success: false,
        statusCode: status,
        message,
      });
    }

    // ✅ Handle microservice plain object
    if (
      typeof exception === 'object' &&
      exception !== null &&
      'statusCode' in exception &&
      'message' in exception
    ) {
      const err = exception as any;

      // 🔥 Log only server errors
      if ((err.statusCode || 500) >= 500) {
        this.logger.error('RPC Exception', err?.stack || JSON.stringify(err));
      }

      return response.status(err.statusCode || 500).json({
        success: false,
        statusCode: err.statusCode || 500,
        message: err.message || 'Error',
      });
    }

    // ✅ fallback (always log)
    this.logger.error('Unhandled exception', exception);

    return response.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
