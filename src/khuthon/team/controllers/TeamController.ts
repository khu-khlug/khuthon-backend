import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { Requester } from '@khlug/khuthon/core/auth/Requester';
import { Roles } from '@khlug/khuthon/core/auth/Roles';
import { MemberUser, UserRole } from '@khlug/khuthon/core/auth/User';
import { TeamService } from '@khlug/khuthon/team/services/TeamService';

import { EditTeamRequestDto } from './dto/member/EditTeamRequestDto';
import { EditTeamResponseDto } from './dto/member/EditTeamResponseDto';
import { IssueAttachmentPresignedPostResponseDto } from './dto/member/IssueAttachmentPresignedPostResponseDto';
import { JoinTeamResponseDto } from './dto/member/JoinTeamResponseDto';
import { RegisterTeamRequestDto } from './dto/member/RegisterTeamRequestDto';
import { RegisterTeamResponseDto } from './dto/member/RegisterTeamResponseDto';
import { UpdateTeamIdeaRequestDto } from './dto/member/UpdateTeamIdeaRequestDto';

@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('/teams')
  @Roles([UserRole.MEMBER])
  @Transactional()
  async registerTeam(
    @Requester() requester: MemberUser,
    @Body() requestDto: RegisterTeamRequestDto,
  ): Promise<RegisterTeamResponseDto> {
    const { memberId } = requester;
    const { teamName } = requestDto;

    const team = await this.teamService.registerTeam(memberId, teamName);

    return new RegisterTeamResponseDto(team);
  }

  @Post('/teams/join')
  @Roles([UserRole.MEMBER])
  @Transactional()
  async joinTeam(
    @Requester() requester: MemberUser,
  ): Promise<JoinTeamResponseDto> {
    const { memberId } = requester;

    const team = await this.teamService.joinTeam(memberId);

    return new JoinTeamResponseDto(team);
  }

  @Patch('/teams/:teamId')
  @Roles([UserRole.MEMBER])
  @Transactional()
  async editTeam(
    @Requester() requester: MemberUser,
    @Param('teamId') teamId: string,
    @Body() requestDto: EditTeamRequestDto,
  ): Promise<EditTeamResponseDto> {
    const { memberId } = requester;
    const { numbers, name, note } = requestDto;

    const team = await this.teamService.editTeam(teamId, memberId, {
      numbers,
      name,
      note,
    });

    return new EditTeamResponseDto(team.id);
  }

  @Delete('/teams/:teamId')
  @Transactional()
  async leaveTeam(
    @Requester() requester: MemberUser,
    @Param('teamId') teamId: string,
  ): Promise<void> {
    const { memberId } = requester;

    await this.teamService.leaveTeam(teamId, memberId);
  }

  @Put('/teams/:teamId/ideas')
  @Transactional()
  async updateTeamIdea(
    @Requester() requester: MemberUser,
    @Param('teamId') teamId: string,
    @Body() requestDto: UpdateTeamIdeaRequestDto,
  ): Promise<void> {
    const { memberId } = requester;
    const { idea } = requestDto;

    await this.teamService.updateTeamIdea(teamId, memberId, idea);
  }

  // TODO[lery]: 파일 업로드 API 구현 후 fileId로 처리하도록 수정하기
  @Post('/teams/:teamId/attachments')
  @Transactional()
  async issueAttachmentPresignedPost(
    @Param('teamId') teamId: string,
  ): Promise<IssueAttachmentPresignedPostResponseDto> {
    const presignedPost =
      await this.teamService.issueAttachmentUploadUrl(teamId);
    return presignedPost;
  }
}
