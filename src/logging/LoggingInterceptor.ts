import {
  CallHandler,
  ConsoleLogger,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NO_BODY_LOG_KEY } from '@khlug/logging/NoBodyLog';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new ConsoleLogger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const shouldNotLogBody = Reflect.getMetadata(
      NO_BODY_LOG_KEY,
      context.getHandler(),
    );

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const traceId = request['traceId'];
    const method = request.method;
    const path = request.url;
    const body = request.body;

    const bodyLog = shouldNotLogBody
      ? ''
      : `\n${JSON.stringify(body, null, 2)}`;
    this.logger.log(
      `Request to '${method} ${path}'${bodyLog}`,
      `traceId='${traceId}'`,
    );

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap((response) =>
          this.logger.log(
            `Response from '${method} ${path}' +${Date.now() - now}ms\n${JSON.stringify(response, null, 2)}`,
            `traceId='${traceId}'`,
          ),
        ),
      );
  }
}
