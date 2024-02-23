import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventEntity } from './entities/EventEntity';
import { MemberEntity } from './entities/MemberEntity';
import { TeamEntity } from './entities/TeamEntity';
import { KhuthonLogger } from './log/KhuthonLogger';
import { SmsSender } from './sms/SmsSender';
import { TeamController } from './team/controllers/TeamController';
import { TeamService } from './team/services/TeamService';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, MemberEntity, TeamEntity])],
  controllers: [TeamController],
  providers: [TeamService, SmsSender, KhuthonLogger],
})
export class KhuthonModule {}
