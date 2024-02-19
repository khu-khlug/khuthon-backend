import { NestFactory } from '@nestjs/core';

import { AppModule } from '@khlug/app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await app.listen(3000);
}

bootstrap();
