import {
  ArgumentsHost,
  Catch,
  ConsoleLogger,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new ConsoleLogger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const traceId = request['traceId'];
    const method = request.method;
    const path = request.url;
    const status = exception.getStatus();

    this.logger.error(
      `Error occurred on '${method} ${path}': '${exception.message}' (status='${status}')\n${exception.stack}`,
      `traceId='${traceId}'`,
    );

    response.status(status).json({
      message: exception.message,
      statusCode: status,
      timestamp: Date.now(),
    });
  }
}
