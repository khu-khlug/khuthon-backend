import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventEntity } from './entities/EventEntity';
import { FileEntity } from './entities/FileEntity';
import { MemberEntity } from './entities/MemberEntity';
import { TeamEntity } from './entities/TeamEntity';
import { VoteEntity } from './entities/VoteEntity';
import { EventService } from './event/services/EventService';
import { KhuthonLogger } from './log/KhuthonLogger';
import { S3Adapter } from './s3/S3Adapter';
import { SmsSender } from './sms/SmsSender';
import { TeamController } from './team/controllers/TeamController';
import { TeamService } from './team/services/TeamService';
import { VoteController } from './vote/controllers/VoteController';
import { VoteService } from './vote/services/VoteService';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventEntity,
      MemberEntity,
      TeamEntity,
      FileEntity,
      VoteEntity,
    ]),
  ],
  controllers: [TeamController, VoteController],
  providers: [
    TeamService,
    EventService,
    VoteService,
    SmsSender,
    KhuthonLogger,
    S3Adapter,
  ],
})
export class KhuthonModule {}
