import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { KhuthonModule } from '@khlug/khuthon/KhuthonModule';
import { HttpExceptionFilter } from '@khlug/logging/HttpExceptionFilter';
import { LoggingInterceptor } from '@khlug/logging/LoggingInterceptor';
import { TraceMiddleware } from '@khlug/logging/TraceMiddleware';

@Module({
  imports: [KhuthonModule],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceMiddleware).forRoutes('*');
  }
}
