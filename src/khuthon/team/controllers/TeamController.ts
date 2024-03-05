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

import { CreateAttachmentRequestDto } from './dto/member/CreateAttachmentRequestDto';
import { CreateAttachmentResponseDto } from './dto/member/CreateAttachmentResponseDto';
import { EditTeamRequestDto } from './dto/member/EditTeamRequestDto';
import { EditTeamResponseDto } from './dto/member/EditTeamResponseDto';
import { InviteTeamMemberRequestDto } from './dto/member/InviteTeamMemberRequestDto';
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
    const { name, note } = requestDto;

    const team = await this.teamService.editTeam(teamId, memberId, {
      name,
      note,
    });

    return new EditTeamResponseDto(team.id);
  }

  @Delete('/teams/:teamId')
  @Roles([UserRole.MEMBER])
  @Transactional()
  async deleteTeam(
    @Requester() requester: MemberUser,
    @Param('teamId') teamId: string,
  ): Promise<void> {
    const { memberId } = requester;

    await this.teamService.deleteTeam(teamId, memberId);
  }

  @Post('/teams/:teamId/invitations')
  @Roles([UserRole.MEMBER])
  @Transactional()
  async inviteTeamMember(
    @Requester() requester: MemberUser,
    @Param('teamId') teamId: string,
    @Body() dto: InviteTeamMemberRequestDto,
  ): Promise<void> {
    const { memberId } = requester;
    const { studentNumber } = dto;

    await this.teamService.inviteTeamMember(teamId, memberId, studentNumber);
  }

  @Delete('/teams/:teamId/invitations/:invitationId')
  @Roles([UserRole.MEMBER])
  @Transactional()
  async cancelTeamInvitation(
    @Requester() requester: MemberUser,
    @Param('teamId') teamId: string,
    @Param('invitationId') invitationId: string,
  ): Promise<void> {
    const { memberId } = requester;

    await this.teamService.cancelInvitation(teamId, memberId, invitationId);
  }

  @Delete('/teams:teamId/members/:memberId')
  @Roles([UserRole.MEMBER])
  @Transactional()
  async deleteTeamMember(
    @Requester() requester: MemberUser,
    @Param('teamId') teamId: string,
    @Param('memberId') targetMemberId: string,
  ): Promise<void> {
    const { memberId } = requester;

    await this.teamService.deleteTeamMember(teamId, memberId, targetMemberId);
  }

  @Put('/teams/:teamId/ideas')
  @Roles([UserRole.MEMBER])
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

  @Post('/teams/:teamId/attachments')
  @Transactional()
  async uploadAttachment(
    @Param('teamId') teamId: string,
    @Body() dto: CreateAttachmentRequestDto,
  ): Promise<CreateAttachmentResponseDto> {
    const { fileId } = dto;

    const attachment = await this.teamService.uploadAttachment(teamId, fileId);

    return new CreateAttachmentResponseDto(attachment);
  }

  @Delete('/teams/:teamId/attachments/:attachmentId')
  @Transactional()
  async deleteAttachment(
    @Param('teamId') teamId: string,
    @Param('attachmentId') attachmentId: string,
  ): Promise<void> {
    await this.teamService.deleteAttachment(teamId, attachmentId);
  }
}
