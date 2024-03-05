import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from './core/CoreModule';
import { AttachmentEntity } from './entities/AttachmentEntity';
import { EmailVerificationEntity } from './entities/EmailVerificationEntity';
import { EventEntity } from './entities/EventEntity';
import { ExaminerEntity } from './entities/ExaminerEntity';
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
import { ManagerExaminerController } from './judge/controllers/ManagerExaminerController';
import { ExaminerManageService } from './judge/services/ExaminerManageService';
import { LoginController } from './login/controllers/LoginController';
import { LoginService } from './login/services/LoginService';
import { MemberController } from './member/controllers/MemberController';
import { MemberService } from './member/services/MemberService';
import { ManagerNoticeController } from './notice/controllers/ManagerNoticeController';
import { ManagerSmsController } from './notice/controllers/ManagerSmsController';
import { NoticeService } from './notice/service/NoticeService';
import { SmsService } from './notice/service/SmsService';
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
      ExaminerEntity,
      AttachmentEntity,
    ]),
    CoreModule,
  ],
  controllers: [
    TeamController,
    VoteController,
    MemberController,
    LoginController,
    FileController,
    ManagerTeamController,
    ManagerNoticeController,
    ManagerExaminerController,
    ManagerSmsController,
  ],
  providers: [
    TeamService,
    EventService,
    VoteService,
    NoticeService,
    MemberService,
    LoginService,
    FileService,
    SmsService,
    TeamManageService,
    ExaminerManageService,
  ],
})
export class KhuthonModule {}
