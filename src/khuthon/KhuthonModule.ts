import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from './core/CoreModule';
import { EventEntity } from './entities/EventEntity';
import { FileEntity } from './entities/FileEntity';
import { JudgeEntity } from './entities/JudgeEntity';
import { MemberEntity } from './entities/MemberEntity';
import { NoticeEntity } from './entities/NoticeEntity';
import { TeamEntity } from './entities/TeamEntity';
import { VoteEntity } from './entities/VoteEntity';
import { EventService } from './event/services/EventService';
import { ManagerNoticeController } from './notice/controllers/ManagerNoticeController';
import { NoticeService } from './notice/service/NoticeService';
import { ManagerTeamController } from './team/controllers/ManagerTeamController';
import { TeamController } from './team/controllers/TeamController';
import { TeamManageService } from './team/services/TeamManageService';
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
      NoticeEntity,
      JudgeEntity,
    ]),
    CoreModule,
  ],
  controllers: [
    TeamController,
    ManagerTeamController,
    VoteController,
    ManagerNoticeController,
  ],
  providers: [
    TeamService,
    TeamManageService,
    EventService,
    VoteService,
    NoticeService,
  ],
})
export class KhuthonModule {}
