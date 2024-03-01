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

import { TeamService } from '@khlug/khuthon/team/services/TeamService';

import { EditTeamRequestDto } from './dto/member/EditTeamRequestDto';
import { EditTeamResponseDto } from './dto/member/EditTeamResponseDto';
import { IssueAttachmentPresignedPostResponseDto } from './dto/member/IssueAttachmentPresignedPostResponseDto';
import { RegisterTeamRequestDto } from './dto/member/RegisterTeamRequestDto';
import { RegisterTeamResponseDto } from './dto/member/RegisterTeamResponseDto';
import { UpdateTeamIdeaRequestDto } from './dto/member/UpdateTeamIdeaRequestDto';

@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('/teams')
  @Transactional()
  async registerTeam(
    @Body() requestDto: RegisterTeamRequestDto,
  ): Promise<RegisterTeamResponseDto> {
    const { member: memberParams, team: teamParams } = requestDto;

    const team = await this.teamService.registerTeam({
      member: {
        studentNumber: memberParams.studentNumber,
        name: memberParams.name,
        university: memberParams.university,
        college: memberParams.college,
        grade: memberParams.grade,
        phone: memberParams.phone,
        email: memberParams.email,
      },
      team: {
        name: teamParams.name,
        note: teamParams.note,
      },
    });

    return new RegisterTeamResponseDto(team);
  }

  @Patch('/teams/:teamId')
  @Transactional()
  async editTeam(
    @Param('teamId') teamId: string,
    @Body() requestDto: EditTeamRequestDto,
  ): Promise<EditTeamResponseDto> {
    // TODO[lery]: 인가 계층 구현 후 수정 필요
    const { numbers, name, note } = requestDto;

    const team = await this.teamService.editTeam(teamId, {
      numbers,
      name,
      note,
    });

    return new EditTeamResponseDto(team.id);
  }

  @Delete('/teams/:teamId')
  @Transactional()
  async leaveTeam(@Param('teamId') teamId: string): Promise<void> {
    // TODO[lery]: 인가 계층 구현 후 수정 필요
    await this.teamService.leaveTeam(teamId, 'memberId');
  }

  @Put('/teams/:teamId/ideas')
  @Transactional()
  async updateTeamIdea(
    @Param('teamId') teamId: string,
    @Body() requestDto: UpdateTeamIdeaRequestDto,
  ): Promise<void> {
    const { idea } = requestDto;

    // TODO[lery]: 인가 계층 구현 후 수정 필요
    await this.teamService.updateTeamIdea('memberId', teamId, idea);
  }

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
