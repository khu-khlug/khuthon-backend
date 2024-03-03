import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { Roles } from '@khlug/khuthon/core/auth/Roles';
import { UserRole } from '@khlug/khuthon/core/auth/User';

import { TeamManageService } from '../services/TeamManageService';
import { UpdateTeamIdeaRequestDto } from './dto/manager/UpdateTeamIdeaRequestDto';
import { UpdateTeamPrizeRequestDto } from './dto/manager/UpdateTeamPrizeRequestDto';

@Controller()
export class ManagerTeamController {
  constructor(private readonly teamManageService: TeamManageService) {}

  @Put('/teams/:teamId/ideas')
  @Roles([UserRole.MANAGER])
  @Transactional()
  async updateTeamIdea(
    @Param('teamId') teamId: string,
    @Body() requestDto: UpdateTeamIdeaRequestDto,
  ): Promise<void> {
    const { idea } = requestDto;
    await this.teamManageService.updateTeamIdea(teamId, idea);
  }

  @Put('/teams/:teamId/prizes')
  @Roles([UserRole.MANAGER])
  @Transactional()
  async updateTeamPrize(
    @Param('teamId') teamId: string,
    @Body() requestDto: UpdateTeamPrizeRequestDto,
  ): Promise<void> {
    const { prize } = requestDto;
    await this.teamManageService.updateTeamPrize(teamId, prize);
  }

  @Delete('/teams/:teamId')
  @Roles([UserRole.MANAGER])
  @Transactional()
  async leaveTeam(@Param('teamId') teamId: string): Promise<void> {
    await this.teamManageService.deleteTeam(teamId);
  }
}
