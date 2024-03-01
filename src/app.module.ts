import { Module } from '@nestjs/common';

import { CoreModule } from './khuthon/core/CoreModule';
import { KhuthonModule } from './khuthon/KhuthonModule';

@Module({
  imports: [CoreModule, KhuthonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
