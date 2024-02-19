import { Module } from '@nestjs/common';

import { CoreModule } from './core/core.module';
import { KhuthonModule } from './khuthon/khuthon.module';

@Module({
  imports: [CoreModule, KhuthonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
