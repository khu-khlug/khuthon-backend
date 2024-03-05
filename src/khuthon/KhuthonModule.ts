import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from './core/CoreModule';
import { EmailVerificationEntity } from './entities/EmailVerificationEntity';
import { EventEntity } from './entities/EventEntity';
import { FileEntity } from './entities/FileEntity';
import { InvitationEntity } from './entities/InvitationEntity';
import { JudgeEntity } from './entities/JudgeEntity';
import { MemberEntity } from './entities/MemberEntity';
import { NoticeEntity } from './entities/NoticeEntity';
import { TeamEntity } from './entities/TeamEntity';
import { VoteEntity } from './entities/VoteEntity';
import { EventService } from './event/services/EventService';
import { FileController } from './file/controllers/FileController';
import { FileService } from './file/services/FileService';
import { LoginController } from './login/controllers/LoginController';
import { LoginService } from './login/services/LoginService';
import { MemberController } from './member/controllers/MemberController';
import { MemberService } from './member/services/MemberService';
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
      EmailVerificationEntity,
      InvitationEntity,
    ]),
    CoreModule,
  ],
  controllers: [
    TeamController,
    ManagerTeamController,
    VoteController,
    ManagerNoticeController,
    MemberController,
    LoginController,
    FileController,
  ],
  providers: [
    TeamService,
    TeamManageService,
    EventService,
    VoteService,
    NoticeService,
    MemberService,
    LoginService,
    FileService,
  ],
})
export class KhuthonModule {}
